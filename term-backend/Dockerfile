FROM node:24-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only package.json and lockfile first
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

# Copy source code
COPY . .

RUN npx prisma generate

# Build the app (this creates dist/main.js)
RUN pnpm build

# Expose backend port
EXPOSE 6011

# Run the compiled app
CMD ["node", "dist/main.js"]
