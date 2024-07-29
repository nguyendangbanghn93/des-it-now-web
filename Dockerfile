# Stage 1: Base stage
FROM node:18-alpine3.18 AS base
WORKDIR /app
COPY package.json yarn.lock ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN yarn install
COPY . .

# Stage 3: Build
FROM dependencies AS build
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then yarn build; fi

# Stage 4: Production stage
FROM node:18-alpine3.18 AS production
WORKDIR /app
COPY --from=dependencies /app .
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]

# Stage 5: Development stage
FROM dependencies AS development 
WORKDIR /app
CMD ["yarn", "dev"]
