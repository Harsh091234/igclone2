# production dockerfile

FROM node:24

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN pnpm install
RUN cd client &&  pnpm run build
RUN cd server && pnpm run build

COPY . .

CMD ["pnpm", "start"]