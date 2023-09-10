# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Node.js and npm

RUN apt-get update && apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Go to the backend folder and install Flask requirements
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Go to the frontend folder and install npm packages
WORKDIR /app/frontend
RUN npm ci

# Expose ports for Flask and React
EXPOSE 8080
EXPOSE 3000

# Run the Flask backend and React frontend concurrently
CMD ["npm", "run", "concurrently"]
