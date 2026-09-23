FROM public.ecr.aws/docker/library/node:22.22.1-bookworm-slim@sha256:4f77a690f2f8946ab16fe1e791a3ac0667ae1c3575c3e4d0d4589e9ed5bfaf3d AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data
RUN mkdir /data && chown node:node /data
COPY dist ./dist
COPY server ./server
COPY src/venues.js ./src/venues.js
COPY package.json ./package.json
USER node
EXPOSE 8080
CMD ["node", "server/app.mjs"]
FROM runtime AS worker
USER root
RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list.d/debian.sources && apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
USER node
CMD ["node", "server/worker.mjs"]
