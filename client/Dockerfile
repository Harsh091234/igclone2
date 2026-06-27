FROM node:24

RUN apt-get update && apt-get install -y  ca-certificates

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host"]