FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 155
CMD ["npm","run", "start"]
