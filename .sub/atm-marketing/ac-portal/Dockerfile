ARG FROM_REGISTRY=artifacts.bcp.absa.co.za

FROM ${FROM_REGISTRY}/bison-cloud/sub-node-14-build-fat:latest as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 
COPY . .
RUN npm run build

FROM ${FROM_REGISTRY}/docker.io/nginx:1.13.7-alpine

COPY --from=build /usr/src/app/dist/atm-marketingpportal-ui/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
