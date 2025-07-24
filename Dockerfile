# Stage 1: Build the Vite application for production
# Use a Node.js image to build the Vite app.
FROM node:20-alpine AS build

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory.
# This allows npm to install dependencies.
COPY package*.json ./

# Install project dependencies.
# Using --force might be necessary if there are peer dependency conflicts,
# but it's generally better to resolve them if possible.
RUN npm install --force

# Copy the rest of the application source code to the working directory.
COPY . .

# Build the Vite application for production.
# This command creates the 'dist' folder with optimized static assets.
# Your package.json has "build": "vite build", so this will use that.
RUN npm run build

# --- DIAGNOSTIC STEPS START ---
# List contents of /app to verify what's there after build
RUN echo "--- Contents of /app after build ---" && ls -l /app
# List contents of /app/dist to confirm if it was created (Vite's default build output)
RUN echo "--- Contents of /app/dist after build ---" && ls -l /app/dist || echo "Error: /app/dist not found or empty!"
# --- DIAGNOSTIC STEPS END ---

# Stage 2: Serve the Vite application with Nginx
# Use a lightweight Nginx image to serve the static files.
FROM nginx:alpine

# Copy the Nginx default configuration file.
# This configuration will be replaced by our custom one, configured for Cloud Run.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx HTML files.
# This ensures Nginx only serves our Vite app's build output.
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Vite application from the 'build' stage to the Nginx webroot.
# Vite's default build output directory is 'dist'.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Cloud Run expects (default 8080).
# Nginx inside the container will listen on the PORT environment variable provided by Cloud Run.
EXPOSE 8080

# Start Nginx when the container launches.
# This is the default command for the nginx:alpine image.
CMD ["nginx", "-g", "daemon off;"]
