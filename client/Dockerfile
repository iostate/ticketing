FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --loglevel verbose
COPY . .

CMD ["npm", "run", "dev"]