FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npx prisma generate \
  && npx prisma migrate deploy \
  && npm run build

# this doesnt work
RUN mkdir -p dist/src/public/ 
COPY src/public/* dist/src/public/

EXPOSE 3002

CMD [ "npm", "run", "start" ]
