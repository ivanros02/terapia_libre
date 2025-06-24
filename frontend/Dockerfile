FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de compilación
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --ignore-scripts
RUN npm rebuild

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]