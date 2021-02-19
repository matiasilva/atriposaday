FROM node:14

# Create app directory
WORKDIR /opt/code

# Install deps
COPY package*.json ./
RUN npm install

# Copy code
COPY . .