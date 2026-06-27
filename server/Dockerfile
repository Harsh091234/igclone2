FROM node:24

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 4000

CMD ["pnpm", "start"]