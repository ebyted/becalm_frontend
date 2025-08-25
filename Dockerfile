# Dockerfile para BeCalm Frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8033
CMD ["nginx", "-g", "daemon off;"]
