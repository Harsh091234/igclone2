FROM node:20

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# Install root
RUN pnpm install

# Install client + server separately
RUN cd client && pnpm install
RUN cd server && pnpm install

# Build
RUN cd client && pnpm run build
RUN cd server && pnpm run build

CMD ["pnpm", "start"]