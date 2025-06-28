# Etapa de construcción
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo dev dependencies para build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
