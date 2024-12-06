###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20.11.0-alpine AS development
RUN npm cache clean --force

RUN apk add --no-cache bash python3 make g++
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
WORKDIR /tmp/app
RUN npm install --ignore-scripts

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh

# Create app directory
WORKDIR /usr/src/app

# # Copy application dependency manifests to the container image.
# # A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# # Copying this first prevents re-running npm install on every code change.
COPY --chmod=644 --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# # Bundle app source
COPY --chmod=644 --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

RUN npm run build

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20.11.0-alpine AS build

WORKDIR /usr/src/app

COPY --chmod=644 --chown=node:node  package*.json ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chmod=644 --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chmod=644 --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --ignore-scripts --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20.11.0-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chmod=644 --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chmod=644 --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
