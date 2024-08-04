FROM node:18.19.1-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run postinstall

RUN npm run build
CMD [ "npm", "run", "preview" ]
