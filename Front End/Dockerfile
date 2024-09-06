# Use an official Node.js image as a base image
FROM node:22.4.0-alpine3.20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

# Expose the development server port (change if needed)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"] 