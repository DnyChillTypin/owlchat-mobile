# OwlChat Mobile

This is the React Native mobile implementation of OwlChat. It is built using **Expo**, **NativeWind (Tailwind)**, and **React Navigation**.

## Prerequisites
1. [Node.js](https://nodejs.org/en/) installed.
2. [Android Studio](https://developer.android.com/studio) installed and an Android Emulator configured.
3. The OwlChat backend instances running and accessible.

## Setup Instructions

1. If you haven't already, install dependencies inside `owlchat-mobile`:
   ```bash
   npm install
   ```
2. Verify `.env` file settings:
   Ensure `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_WS_BASE_URL` correctly point to your local development server. 
   *(Note: `10.0.2.2` is the special alias to your host loopback interface `127.0.0.1` from within the Android emulator).*

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Launch the Android Emulator:
   Once Metro Bundler starts, press the `a` key in the terminal to launch the app on your Android Emulator. 

## Structure
- `src/navigation`: AppNavigator with Stack patterns
- `src/screens`: UI screens grouped by feature
- `src/providers`: App contexts (`Auth`, `WebSocket`, `Theme`)
- `src/services`: API service endpoints porting web implementations 
