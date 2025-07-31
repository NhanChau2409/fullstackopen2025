FROM node:18-alpine as test-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run test:run

FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=test-stage /app/src ./src
COPY --from=test-stage /app/public ./public
COPY --from=test-stage /app/vite.config.js ./
COPY --from=test-stage /app/index.html ./

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 