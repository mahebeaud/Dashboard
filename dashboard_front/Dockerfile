FROM node:alpine

WORKDIR /dashboard_front

COPY . .

RUN npm install --legacy-peer-deps

CMD [ "npm", "run", "dev" ]

EXPOSE 8081