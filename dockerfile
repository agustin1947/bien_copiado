FROM node:20

WORKDIR /app

# Copiamos solo package.json primero (cachea dependencias)
COPY package*.json ./

# Instalamos dependencias UNA SOLA VEZ
RUN npm install --legacy-peer-deps

# Copiamos el resto del proyecto
COPY . .

EXPOSE 1337

CMD ["npm", "run", "develop"]