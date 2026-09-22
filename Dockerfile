FROM node:22.22.1-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

FROM node:22.22.1-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data
RUN mkdir /data && chown node:node /data
COPY --from=build /app/dist ./dist
COPY server ./server
USER node
EXPOSE 8080
CMD ["node", "server/app.mjs"]

FROM runtime AS worker
USER root
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
USER node
CMD ["node", "server/worker.mjs"]
