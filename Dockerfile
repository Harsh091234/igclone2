FROM node:24

RUN apt-get update && apt-get install -y ffmpeg ca-certificates

WORKDIR /app

RUN npm install -g pnpm

COPY . .


ENV CI=true
# Install client + server separately
RUN cd client && pnpm install 
RUN cd server && pnpm install  

# Build
RUN cd client && pnpm run build
RUN cd server && pnpm run build

CMD ["pnpm", "start"]