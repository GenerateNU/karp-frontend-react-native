# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Docker Support

This project includes Docker support for containerized development.

### Using Docker

1. **Build the Docker image:**
   ```bash
   docker build -t karp-frontend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8081:8081 -p 19000:19000 -p 19002:19002 karp-frontend
   ```

3. **Run with environment variables:**
   ```bash
   docker run -p 8081:8081 -p 19000:19000 -p 19002:19002 \
     -e EXPO_PUBLIC_API_URL=http://your-api-url:3000/api \
     -e EXPO_PUBLIC_APP_ENV=production \
     karp-frontend
   ```

4. **Using an .env file:**
   ```bash
   docker run -p 8081:8081 -p 19000:19000 -p 19002:19002 \
     --env-file .env \
     karp-frontend
   ```

### Environment Variables

The Docker setup supports the following environment variables:

#### Expo Public Variables (accessible in client code)
- `EXPO_PUBLIC_API_URL`: API endpoint URL
- `EXPO_PUBLIC_APP_ENV`: Application environment (development, staging, production)
- `EXPO_PUBLIC_DEBUG_MODE`: Enable debug mode (true/false)

#### Development Variables
- `EXPO_TUNNEL_SUBDOMAIN`: Custom subdomain for Expo tunnel
- `EXPO_DEVTOOLS_LISTEN_ADDRESS`: DevTools listening address (default: 0.0.0.0)
- `EXPO_USE_METRO`: Use Metro bundler (default: true)

#### Example .env file:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_TUNNEL_SUBDOMAIN=karp-dev
```

### Docker Features

- Uses Bun as the JavaScript runtime for faster package management
- Includes Expo CLI for development
- Configured for development with proper port exposure
- Optimized with .dockerignore for faster builds
- Runs as non-root user for security
- Supports environment variable injection

### Accessing the App

After running the Docker container, you can access:
- **Metro bundler**: http://localhost:8081
- **Expo DevTools**: http://localhost:19002
- **Development server**: http://localhost:19000

Use the Expo Go app or development build to connect to the running development server.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
