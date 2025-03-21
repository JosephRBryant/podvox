#Builds api
FROM --platform=amd64 node:18-alpine as backend

WORKDIR /backend

COPY /backend/package.json .

RUN npm install

COPY /backend .


#builds frontend

FROM --platform=amd64 node:18-alpine as frontend

WORKDIR /frontend

COPY frontend/package.json .

RUN npm install

COPY /frontend/ .

RUN npm run build

# Builds production image for deply

FROM --platform=amd64 node:18-alpine as production

# Hardcoded to production to avoid having to fill this out. Lets you run production staging build locally
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Fill out this out (or change node_env to development if running local docker testing) on render/docker
ARG SCHEMA
ENV SCHEMA=${SCHEMA}

# Fill this out on render using internal db url, or external url if running locally on docker
#schema for render
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Fill this out on render/docker
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

# 1 week JWT. Pre-filled in to avoid having to do this in render
ARG JWT_EXPIRES_IN=60400
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}

#AWS
ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ARG AWS_BUCKET_NAME
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME}

WORKDIR /var/www

COPY /backend/package.json .
COPY /backend/.sequelizerc .
COPY --from=backend backend ./backend
COPY /backend/config/database.js /var/www/config/database.js

COPY --from=backend backend/db/seeders /var/www/db/seeders
COPY --from=backend backend/db/migrations /var/www/db/migrations
COPY --from=backend backend/config /var/www/config

COPY --from=frontend frontend/dist ./frontend/dist

RUN npm install --only=production

COPY --from=backend backend ./backend

COPY ./package.json .


EXPOSE 8000

# CMD [ "npm", "start" ]

# CMD ["sh", "-c", "npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]

CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]
