# Subatomic Application Helm Chart

## Concepts
This Helm chart is used to deploy Subatomic applications into your Kubernetes clusters.
This default Helm chart is designed to allow a deployment of an application to multiple clusters 
in active/active and creates the following resources:
 - Deployment
 - Service
 - Ingress (optional)

This chart is configured through the various `values.yaml` files in this folder. There are two
types of `values.yaml` files by default:

 - One `values.yaml`
 - Multiple `values-xxx.yaml` (environment values files)
 
The `values.yaml` has all the default values that will be applied to all deployments in all
environments, whilst the `values-xxx.yaml` file contains values only applied to to the 
environment `xxx`. The `values-xxx.yaml` values apply to each cluster where the environment 
`xxx` exists (e.g. sdc dev and 270 dev). Additionally any value appearing in `values-xxx.yaml`
 and `values.yaml` will have the value in `values-xxx.yaml` preferred. For example:
 
`values.yaml`
```yaml
replicas: 1
buildID: 75
```

`values-dev.yaml`
```yaml
replicas: 2
```

The above configuration will result in the merged values below when doing a dev deployment
```yaml
replicas: 2
buildID: 75
```

**Note:** Deep merges do not happen on values - Root values are merged and overlaid only.
Example:

`values.yaml`
```yaml
a:
 b: 1
```

`values-dev.yaml`
```yaml
a:
 c: 2
```

Will become 
```yaml
a:
 c: 2
```

See the full [configuration](#configuration) glossary for details on all values that can be set.

## Common Tasks
This section describes instructions on how to perform a few common tasks when working with this 
Helm Chart.

### Environment Variables
Adding environment variables to an application can be done by adding a section like the following to the
appropriate `values` file:

```yaml
env:
  VAR_1: "Value1"
  VAR_2: "Value2"
```

To use secrets or config files as env vars the envRaw (uses standard kubernetes env var syntax) key can be used too:

```yaml
envRaw:
- key: VAR_1
  value: "Value1"
- key: VAR_2
  value: "Value2"
```

### Volumes and Mounts
Adding volumes and volumeMounts to an application can be done by adding a section like the following to the
appropriate `values` file:

```yaml
volumes:
  - name: secret-mount
    secret:
      secretName: kube-secret-name
  - name: config-mount
    configMap:
      name: kube-config-map-name
      
volumeMounts:
  - name: secret-mount
    mountPath: /path/to/secret/mount/folder/
    
  - name: config-mount
    mountPath: /path/to/config/mount/folder/
```

The above mounts the keys of the secret `kube-secret-name` at the location `/path/to/secret/mount/folder/` with
each key as a file at the target location. Additionally the the keys of the secret `kube-config-map-name` at the 
location `/path/to/config/mount/folder/` with each key as a file at the target location.

### Adding a GSLB ingress
Adding a gslb ingress creates a url that load balances traffic between identical environments in both your target 
clusters (e.g dev in sdc and dev in 270). Example:

Assume you have the following autogenerated ingress's for you application
- Ingress for 270: `my-app-dev.my-cluster.270-nonprod.caas.absa.co.za`
- Ingress for sdc: `my-app-dev.my-cluster.sdc-nonprod.caas.absa.co.za`

To add a gslb ingress for the dev instance of you application add the following to the `values-dev.yaml` file:
```yaml
ingress:
  gslb: "my-app-dev.my-cluster.nonprod.caas.absa.co.za"
```
Notice that the ingress is the same as the those for sdc and 270, minus the `270-` and `sdc-` parts of the ingress
definition. After committing and redeploying your application would be accessible via the load balanced ingress defined
above.

### Adding TLS to ingress's
TLS can be set for all ingress's using the following setting
```yaml
ingress:
  tls: true
```
This applies to fqdn and gslb ingress urls.

### Adding Vanity ingress's
Upon securing a vanity URL from the DNS team (speak to the BKS for guidance) you can use these URL's to front your
application. This can be done using the following option
```yaml
vanityIngress:
  host: my-app.custom-domain.absa.co.za
  tls: true
  clusterIssuer: name-of-cluster-cert-issuer
```

Or if not using a cluster issuer to create the secret cert:

```yaml
vanityIngress:
  host: my-app.custom-domain.absa.co.za
  tls: true
  secretName: name-of-cert-secret
```

## Configuration
The table below explains the various values that can be set in your values files.

| Parameter                     | Description                                                                                                                                         | Required | Example                                                                                                           |
| :-------------                | :-------------                                                                                                                                      | :-----   | :------                                                                                                           |
| replicas                      | Defines the number of pods will run in each cluster                                                                                                 | true     | 2                                                                                                                 |
| image.*                       | All details about the image Kubernetes uses for the deployment of your app                                                                          | false    | N/A                                                                                                               |
| image.repository              | Location to pull the app image from. This is set by jenkins on each run                                                                             | true     | harbor.bison.sdc-prod.caas.absa.co.za/team/project_app                                                            |
| image.tag                     | The tag of the `image.repository` app image to. This is set by jenkins on each run                                                                  | true     | 1-abc324dc                                                                                                        |
| image.pullPolicy              | The Kubernetes imagePullPolicy for the app deployments                                                                                              | true     | Always                                                                                                            |
| buildID                       | Sets an annotation on the deployment to help link deployment version to jenkins builds. Set automatically by jenkins                                | true     | 34                                                                                                                |
| service.*                     | All details used to create a Kubernetes service to route network traffic to your deployments pods                                                   | false    | N/A                                                                                                               |
| service.name                  | The name of the Service resource. If not specified, the same name as the deployment name is used.                                                   | false    | my-service                                                                                                        |
| service.type                  | Type of the Kubernetes service                                                                                                                      | true     | Always                                                                                                            |
| service.internalPort          | Pod port to route network traffic to                                                                                                                | true     | 8080                                                                                                              |
| service.externalPort          | Traffic to this port on the Service is routed to the internalPort on the Pod                                                                        | true     | 80                                                                                                                |
| service.annotations           | Kubernetes annotations to add to the Service                                                                                                        | false    | key-value pairs                                                                                                   |
| subatomic                     | Subatomic details for the app. These are used as annotations for the Sub team for various processes. Please do not edit                             | false    | key-value pairs                                                                                                   |
| env                           | Key value pairs that translate into environment variables in the app container.                                                                     | false    | key-value pairs                                                                                                   |
| ingress.*                     | All details related to defining a Kubernetes ingress for your application.                                                                          | false    | N/A                                                                                                               |
| ingress.fqdn                  | A default ingress url to create for the application. This is autogenerated by jenkins so you should not set it directly                             | false    | app-dev.cluster.sdc-nonprod.caas.absa.co.za                                                                       |
| ingress.gslb                  | An additional ingress url to add to your application which can be used to add a gslb route to your application.                                     | false    | app-dev.cluster.sdc-nonprod.caas.absa.co.za                                                                       |
| ingress.tls                   | Whether your urls are created using tls or not.                                                                                                     | false    | true                                                                                                              |
| vanityIngress.*               | All details related to defining a Kubernetes vanity ingress for your application.                                                                   | false    | N/A                                                                                                               |
| vanityIngress.host            | An ingress host with custom domain for vanity urls. Speak to the BKS team for assistance with this.                                                 | false    | app.custom.absa.co.za                                                                                             |
| vanityIngress.tls             | Whether your urls are created using tls or not.                                                                                                     | false    | true                                                                                                              |
| vanityIngress.secretName      | Secret containing tls cert.                                                                                                                         | false    | N/A                                                                                                               |
| vanityIngress.clusterIssuer   | The certificate cluster issuer name to use. If not specified, secrets need to be added manually. Speak to the Subatomic or BKS teams for assistance | false    | my-cluster-issuer                                                                                                 |
| resources.*                   | Kubernetes resource requests and limits for the container. Defined in the same way normal Kubernetes resources are.                                 | false    | See [here](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)                 |
| volumes.*                     | Kubernetes volumes available to the container. Defined in the same way normal Kubernetes volumes are.                                               | false    | See [here](https://kubernetes.io/docs/concepts/storage/volumes/)                                                  |
| volumeMounts.*                | Kubernetes volumeMounts added to the container. Defined in the same way normal Kubernetes volumeMounts are.                                         | false    | See [here](https://kubernetes.io/docs/concepts/storage/volumes/)                                                  |
| terminationGracePeriodSeconds | The number of seconds to wait for the pods to exit gracefully before forcefully ending them.                                                        | false    | 10                                                                                                                |
| livenessProbe.*               | Kubernetes livenessProbe for the container. Defined in the same way normal Kubernetes livenessProbes are.                                           | false    | See [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |
| readinessProbe.*              | Kubernetes readinessProbe for the container. Defined in the same way normal Kubernetes readinessProbe are.                                          | false    | See [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |