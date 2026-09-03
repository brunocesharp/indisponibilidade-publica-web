# ── Dockerfile da Aplicação Pública (indisponibilidade-publica-web) ──────────
# Build Angular 20 (dist/aplicacao-publica/browser) + Nginx. Publicada na DMZ, sem autenticação.

ARG BUILD_CONFIG=producao

FROM node:20-alpine AS build
ARG BUILD_CONFIG
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration ${BUILD_CONFIG}

FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/aplicacao-publica/browser /usr/share/nginx/html
EXPOSE 80
