FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npx prisma generate \
  && npx prisma migrate deploy \
  && npm run build

COPY src/public/* dist/src/public/

EXPOSE 3002

CMD [ "npm", "run", "start" ]