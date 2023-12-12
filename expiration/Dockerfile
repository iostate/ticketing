FROM node:18.18.2-alpine3.18

WORKDIR /app
COPY package.json .
RUN npm install --omit-dev
COPY . .

CMD ["npm", "start"]