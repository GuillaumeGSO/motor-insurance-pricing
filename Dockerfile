# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the NestJS default port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]