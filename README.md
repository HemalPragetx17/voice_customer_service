# Voice Assistant App

A real-time speech-to-text voice assistant built with React and the Web Speech API.

## Setup Guide

Follow these steps to set up the existing Voice Assistant project on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed on your system:
- Node.js (v14.0.0 or later)
- npm (v7.0.0 or later) or yarn (v1.22.0 or later)

### Step 1: Clone the repository

```bash
git clone https://github.com/HemalPragetx17/voice_customer_service.git
cd voice_customer_service
```

### Step 2: Install dependencies

Install the project dependencies:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn
```

### Step 3: Start the development server

Launch the development server to run the application locally:

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

The application should now be running at `http://localhost:5173` (or another port if 5173 is already in use).

### Step 4: Access the application

Open your web browser and navigate to:
```
http://localhost:5173
```

## Browser Compatibility

This app uses the Web Speech API which is supported in:
- Chrome (desktop & Android)
- Edge
- Safari (macOS & iOS)
- Firefox

Note: Browsers will request permission to use the microphone when you click the "Call" button.

## Building for Production

To create a production build:

**Using npm:**
```bash
npm run build
```

**Using yarn:**
```bash
yarn build
```

The optimized production files will be generated in the `dist` directory.

## Troubleshooting

- **Microphone not working**: Ensure your browser has permission to access the microphone
- **Speech recognition errors**: Check that your browser supports the Web Speech API
- **Dependencies installation issues**: Try removing `node_modules` folder and `package-lock.json` (or `yarn.lock`), then reinstall dependencies