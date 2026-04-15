FROM node:20-bookworm-slim
WORKDIR /app

# npm ci pokreće postinstall (setup-env.cjs) prije COPY . — pa scripts/ još ne postoji u imageu.
# Zato preskoči lifecycle skripte na installu, pa eksplicitno rebuildaj native modul.
RUN apt-get update && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm rebuild better-sqlite3

COPY . .
RUN mkdir -p data
# postinstall se ne pokreće (--ignore-scripts) — klijent za Prisma mora postojati da se chatService učita
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.cjs"]
