# --- этап 1: собираю статику ---
FROM node:22-alpine AS build
WORKDIR /app

# сначала только списки зависимостей: npm ci пересобирается, только если они поменялись
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- этап 2: Nginx отдаёт готовые файлы, Node в итоговом образе не нужен ---
FROM nginx:1.28-alpine
COPY nginx/site.conf /etc/nginx/snippets/site.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80