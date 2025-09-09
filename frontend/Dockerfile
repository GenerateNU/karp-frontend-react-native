# Use official Bun image
FROM oven/bun:1-alpine

# Set working directory
WORKDIR /app

# Note: Using minimal setup - bun:alpine already includes git and essential tools

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies using Bun
RUN bun install

# Install Expo CLI using Bun (experimental)
RUN bun add -g @expo/cli

# Create a non-root user for security
RUN addgroup -g 1001 -S bunuser
RUN adduser -S expo -u 1001 -G bunuser

# Fix ownership of installed dependencies
RUN chown -R expo:bunuser /app

# Copy the rest of the application and set proper ownership
COPY --chown=expo:bunuser . .

# Set environment variables for Expo development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_USE_METRO=true

# Expose the default Expo development server port
EXPOSE 8081

# Expose the default Metro bundler port
EXPOSE 19000

# Expose the default Expo DevTools port
EXPOSE 19002

# Switch to non-root user
USER expo

# Set Bun as the runtime for scripts
ENV BUN_RUNTIME=bun

# Default command to start the Expo development server with Bun
# Using --host lan to allow external connections to the container
CMD ["bun", "--bun", "expo", "start", "--host", "lan"]