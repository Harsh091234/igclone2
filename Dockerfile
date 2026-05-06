FROM node:20

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# 1️⃣ Copy only package files (for caching)
COPY package.json pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# 2️⃣ Install dependencies
RUN pnpm install

# 3️⃣ NOW copy full source code
COPY . .

# 4️⃣ Build client + server
RUN cd client && pnpm run build
RUN cd server && pnpm run build

# 5️⃣ Start app
CMD ["pnpm", "start"]