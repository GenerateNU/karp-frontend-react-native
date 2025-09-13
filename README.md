# Karp Mobile App

This is the repository for all the frontend related to the Karp mobile app, specifically for the customer facing portal

We are using React Native

# Setup Instructions

1. Install Node.js if you have not already (make sure you have version 20.19 or above)
- Download from https://nodejs.org/en : Click the 'Get Node.js' button and run the commands displayed
- To confirm your installation run:
    - ```node -v```
    - ```npm -v```
2. Install bun using Homebrew (```brew tap oven-sh/bun``` and ```brew install bun```) or a script (```curl -fsSL https://bun.sh/install | bash```)
3. cd into ```frontend``` and run ```bun install```
4. Run ```npx expo start``` (there are more instructions in the ```README.md``` file in ```./frontend``` regarding this stuff)
5. Install the Expo Go mobile app from the App Store (or whatever store your OS has)
6. Scan the QR code in the terminal to view the app
7. Run ```cd ..```
8. Run ```python3 -m venv venv```
9. Run ```source venv/bin/activate```
10. Run ```pip install -r requirements.txt```
11. Run ```pre-commit install```