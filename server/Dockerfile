# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Run any build steps here (e.g., building TypeScript, running tests)

# Stage 2: Create a lightweight image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "./app.js"]