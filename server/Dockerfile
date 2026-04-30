FROM node:24

WORKDIR /app

RUN npm install -g pnpm
RUN apt-get update && apt-get install -y ffmpeg
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 4000

CMD ["pnpm", "dev"]