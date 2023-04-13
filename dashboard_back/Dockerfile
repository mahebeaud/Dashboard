FROM node:alpine

WORKDIR /dashboard_back

COPY . .

RUN npm install --legacy-peer-deps

CMD ["npm", "run", "dev"]

EXPOSE 8080