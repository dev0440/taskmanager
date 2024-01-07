from node:20.10.0-alpine3.18

workdir /opt/server

copy package.json package-lock.json .

run npm install

copy . .

run npm run build 

cmd ["npm", "run", "start"]


