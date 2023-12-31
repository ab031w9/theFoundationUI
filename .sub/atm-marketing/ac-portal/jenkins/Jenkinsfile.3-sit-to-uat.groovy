properties([buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '1')), durabilityHint('PERFORMANCE_OPTIMIZED')])

def label = "worker-${UUID.randomUUID().toString()}"

def registryCredentialSecretName = "regcred"

languagePack = "nodejs14nginx117"

kubeconfigDir = "/kubeconfigs"

subatomicTeamName = "alt-phys-chan-team"
subatomicProjectName = "atm-marketing"
subatomicAppName = "ac-portal"
subatomicHomeFolder = ".sub/${subatomicProjectName}/${subatomicAppName}"
hasIngress = true

nonprodClusters = [
    [
        name: "rbb-banking-nonprod-270",
        fqdn: "rbb-banking.270-nonprod.caas.absa.co.za",
        kubeconfigConfigmapName: "rbb-banking-nonprod-270-kubeconfig"
    ], 
    [
        name: "rbb-banking-nonprod-sdc",
        fqdn: "rbb-banking.sdc-nonprod.caas.absa.co.za",
        kubeconfigConfigmapName: "rbb-banking-nonprod-sdc-kubeconfig"
    ]
]

nonprodEnvironments = ["sit", "uat"]

prodClusters = [
    [
        name: "rbb-banking-prod-sdc",
        fqdn: "rbb-banking.sdc-prod.caas.absa.co.za",
        kubeconfigConfigmapName: "rbb-banking-prod-sdc-kubeconfig"
    ], 
    [
        name: "rbb-banking-prod-270",
        fqdn: "rbb-banking.270-prod.caas.absa.co.za",
        kubeconfigConfigmapName: "rbb-banking-prod-270-kubeconfig"
    ]
]

prodEnvironments = []

selectTagFromEnvironment = true

// Initialise docker registry details initializeJenkinsConfig
initializeJenkinsConfig()

def initializeJenkinsConfig() {
    withCredentials([string(credentialsId: 'sub-jenkins-config', variable: 'SUB_JENKINS_CONFIG_RAW')]) {
        def subJenkinsConfig = new groovy.json.JsonSlurper().parseText("${SUB_JENKINS_CONFIG_RAW}")

        baseDockerRegistry = subJenkinsConfig.containerRegistry.activeRegistry
        teamDockerRepoName = "${subatomicTeamName}"
        if( subJenkinsConfig.containerRegistry.keySet().contains( 'teamDockerRepoName' ) ) {
            teamDockerRepoName = subJenkinsConfig.containerRegistry.teamDockerRepoName
        }
        dockerPushProject = "${baseDockerRegistry}/${teamDockerRepoName}"
        dockerPullProject = "${baseDockerRegistry}/bison-cloud"
    }
}

/*
Deploy the application into a given environment in a given cluster using the given tag.

Note: Must be run in a 'sub-build-tools' container
*/
def deploy(environment, imageTag, cluster) {
    def namespace = "${subatomicTeamName}-${subatomicProjectName}-${environment}"
    log("Starting helm upgrade in ${namespace} namespace...")

    def valueFileOptions = getAllValueFileOptions(environment, cluster.name)

    def setFQDNCommand = ""
    if (cluster.fqdn != null && hasIngress) {
        setFQDNCommand = "--set ingress.fqdn=${subatomicAppName}.${subatomicProjectName}-${environment}.${cluster.fqdn}"
    }

    // output the helm templates for troubleshooting
    sh "helm template ${subatomicHomeFolder}/charts/ \
           --values=${subatomicHomeFolder}/charts/values-${environment}.yaml \
           --values=${subatomicHomeFolder}/charts/values.yaml \
           ${setFQDNCommand} \
           --set buildID=${imageTag}"

    // If the first installation fails, wipe it. This is a limitation of Helm https://github.com/helm/helm/issues/3353
    sh "if helm history --kubeconfig='${kubeconfigDir}/${cluster.kubeconfigConfigmapName}/kubeconfig.yaml' --namespace=${namespace} --max 1 ${subatomicAppName} 2>/dev/null | grep pending-install | cut -f1 | grep -q 1; then helm delete --kubeconfig='${kubeconfigDir}/${cluster.kubeconfigConfigmapName}/kubeconfig.yaml' --namespace=${namespace} ${subatomicAppName}; fi"

    // Fix helm history if any resources are deprecated
    sh "helm mapkubeapis ${subatomicAppName} --kubeconfig='${kubeconfigDir}/${cluster.kubeconfigConfigmapName}/kubeconfig.yaml' --namespace=${namespace} || true"

    sh "sub_build_tools kube watch-deployment --namespace=${namespace} --kube_config_file='${kubeconfigDir}/${cluster.kubeconfigConfigmapName}/kubeconfig.yaml' --deployment_name=${subatomicAppName}-${languagePack} & \
        helm upgrade --install ${subatomicAppName} ${subatomicHomeFolder}/charts \
           --atomic \
           --kubeconfig='${kubeconfigDir}/${cluster.kubeconfigConfigmapName}/kubeconfig.yaml' \
           --namespace=${namespace} \
           --set image.repository=${dockerPushProject}/${subatomicProjectName}_${subatomicAppName} \
           --set image.tag=${imageTag} \
           ${valueFileOptions} \
           ${setFQDNCommand} \
           --set buildID=${imageTag}"
}

def getValueFileOption(valuesFileName) {
    def valuesFilePath = "${subatomicHomeFolder}/charts/${valuesFileName}"
    if (fileExists(valuesFilePath)) {
        return "--values ${valuesFilePath}"
    } else {
        return ""
    }
}

def getAllValueFileOptions(environment, clusterName) {
    def defaultValues = getValueFileOption("values.yaml")
    def environmentValues = getValueFileOption("values-${environment}.yaml")
    def clusterValues = getValueFileOption("values-${environment}-${clusterName}.yaml")
    def valuesFiles = "${defaultValues} \
        ${environmentValues} \
        ${clusterValues}"

    return valuesFiles
}

/*
Deploy the application into a given environment in a given set of clusters using the given tag.

Note: Must be run in a 'sub-build-tools' container
*/
def deployToClusters(environment, baseImageTag, clusters, retagToTag = null) {
    // Tag the image with the correct environment prefix to make sure the image is retained
    // using the harbor tag retention policies
    if (retagToTag == null){
        retagToTag = "${environment}-${baseImageTag}"
    }
    log("Retag ${baseImageTag} to ${retagToTag}")
    sh "sub_build_tools docker retag-image \
        --registry_url=https://${baseDockerRegistry} \
        --image_name=${teamDockerRepoName}/${subatomicProjectName}_${subatomicAppName} \
        --auth_file='/docker/auth/.dockerconfigjson' \
        --original_tag=${baseImageTag} --new_tag=${retagToTag}"

    // For each cluster, deploy the application helm chart to the appropriate environment
    clusters.each { cluster ->
        log("Deploying to ${cluster.name}:${subatomicProjectName}-${environment}")
        deploy(environment, "${retagToTag}", cluster)
        log("Deployment to ${cluster.name}:${subatomicProjectName}-${environment} completed successfully.")
    }
}

def findImageTags(numTags, prefixFilter) {
    def imageTagsRaw = sh (
        script: "sub_build_tools docker get-tags --registry_url=https://${baseDockerRegistry} --image_name=${teamDockerRepoName}/${subatomicProjectName}_${subatomicAppName} --auth_file='/docker/auth/.dockerconfigjson' --prefix_filter=${prefixFilter}",
        returnStdout: true
    ).trim()

    log("Image tags found")
    log(imageTagsRaw)

    return new groovy.json.JsonSlurper().parseText(imageTagsRaw)
}

def logMetrics(message) {
    log("[${subatomicTeamName}, ${subatomicProjectName}, ${subatomicAppName}, ${JOB_URL}, ${BRANCH_NAME}, ${BUILD_NUMBER}] - ${message}")
}

def log(message) {
    def now = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone("UTC"))
    echo "[${now}][Subatomic] - ${message}"
}

def logStage(stageName) {
    def line = "-".multiply("Stage: ${stageName}".length())
    echo "${line}\nStage: ${stageName}\n${line}"
    logMetrics("Stage ${stageName} started")
}

logMetrics("Jenkins Job Started")

podTemplate(label: label, containers: [
    containerTemplate(name: 'sub-build-tools', image: dockerPullProject + '/sub-build-tools:v2', command: 'cat', ttyEnabled: true, alwaysPullImage: true),
], 
volumes: [
    secretVolume(mountPath: '/docker/auth/', secretName: "${registryCredentialSecretName}"),
    emptyDirVolume(mountPath: '${kubeconfigDir}', memory: false)
],
imagePullSecrets: ["${registryCredentialSecretName}"]){
    node(label) {
        // Please do not remove this
        logMetrics("Jenkins Worker Scheduled")

        def myRepo = checkout scm

        def baseImageTag = null
        def selectedTag = null

        stage('Select tag to promote') {
            container("sub-build-tools") {
                // Determine how to filter images
                def tagFilter = ""
                def selectionMessage = "Last 10 tags built"

                if (selectTagFromEnvironment){
                    def environmentToPromoteFrom = nonprodEnvironments[0]
                    nonprodEnvironments.remove(0)
                    tagFilter = "${environmentToPromoteFrom}-"
                    selectionMessage = "Last 10 tags deployed to ${environmentToPromoteFrom}"
                }

                def availableTags = findImageTags(10, tagFilter)
                selectedTag = input(
                        message: 'Please select the tag you wish to promote',
                        ok: "Deploy tag",
                        parameters: [choice(name: 'selectedTag', choices: availableTags, description: selectionMessage)]
                )
                if (selectTagFromEnvironment){
                    // Remove the env- string from tag name to find the base image tag
                    baseImageTag = selectedTag.substring(tagFilter.length())
                }
            }
        }


        stage('Prepare') {
            logStage("Prepare")
            container("sub-build-tools") {
                log("Mount kubeconfigs needed for deployment to external clusters")
                nonprodClusters.each { cluster ->
                    sh "sub_build_tools kube mount-configmap --configmap_name=${cluster.kubeconfigConfigmapName} --destination_dir='${kubeconfigDir}'"
                }
                prodClusters.each { cluster ->
                    sh "sub_build_tools kube mount-configmap --configmap_name=${cluster.kubeconfigConfigmapName} --destination_dir='${kubeconfigDir}'"
                }
            }
        }

        log("Starting Deployments")

        // For each non prod environment deploy helm chart to each associated nonprod cluster
        // Example deploy application "my-app" to the "dev" environment in both sdc and 270
        nonprodEnvironments.each { nonProdEnvironment ->
            stage("Deploy NonProd ${nonProdEnvironment}") {
                logStage("Deploy NonProd ${nonProdEnvironment}")
                container('sub-build-tools') {
                    deployToClusters(nonProdEnvironment, selectedTag, nonprodClusters, "${nonProdEnvironment}-${baseImageTag}")
                }
            }
        }

        // For each prod environment deploy helm chart to each associated prod cluster
        // Example deploy application "my-app" to the "dev" environment in both sdc and 270
        prodEnvironments.each { prodEnvironment ->
            stage("Deploy Prod ${prodEnvironment}") {
                logStage("Deploy Prod ${prodEnvironment}")
                container('sub-build-tools') {
                    deployToClusters(prodEnvironment, selectedTag, prodClusters, "${prodEnvironment}-${baseImageTag}")
                }
            }
        }

        // Please do not remove this
        logMetrics("Jenkins Job Completed")
    }
}
