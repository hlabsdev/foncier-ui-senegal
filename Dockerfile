FROM node:12.16.3-alpine as builder

RUN apk add git

COPY package.json package-lock.json ./

RUN npm install && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

RUN npm run build:no-optimizer

FROM nginx:1.13.3-alpine as dist

EXPOSE 4200
EXPOSE 4201

COPY --from=builder  /app/dist /usr/share/nginx/html
COPY --from=builder /app//nginx.conf /etc/nginx/conf.d/nginx.conf.template
COPY --from=builder /app/run.sh /run.sh

CMD ["/bin/sh", "/run.sh"]
