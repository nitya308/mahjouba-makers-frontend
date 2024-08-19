# Mahjouba Riders Frontend

Frontend for craftsmen to find, accept, and complete (+ receive payment for) jobs to create parts for electric scooters built by the Mahjouba Initiative.

## Designs

[Link to the project Figma](https://www.figma.com/file/rcOfcvZOeWk6nu4GqHAHI1/Mahjouba-Initiative-23F?type=design&mode=design&t=m3PQAB3jcMtY0YEQ-0)

[2-4 screenshots from the app]

## Architecture
### Tech Stack
- [Expo Go](https://expo.dev/client)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [axios](https://github.com/axios/axios)
- [TypeScript](https://www.typescriptlang.org/docs/)

#### External Packages
- [native-base](https://nativebase.io/)
- [react-i18next](https://react.i18next.com/)
- [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/)

## Setup Steps

Due to the native code being used in this project, we are using a bare Expo flow rather than a managed Expo flow; i.e., you need to run this thorugh the iOS simulator on MacOS rather than through the Expo mobile app scanning a QR code. (Sorry, Windows users - you're out of luck.)

1. clone repo and `yarn install`
   - We are using yarn because npm has issues with installing peer dependencies, which in turn causes issues when you eventually want to deploy to TestFlight
2. Change `SERVER_URL` endpoint depending on if you are using hosted backend or local backend
3. `cd ios` and `pod install`
4. `npx run-ios`, and the app should be ready for use
   - If the build fails, usually it is enough to try building the `.xcworkspace` file from XCode and fixing whatever error shows up based on XCode's recommendation
      - ![img](https://i.imgur.com/6WCL7Gd.png)

<hr/>

Designed and developed by [@DALI Lab](https://github.com/dali-lab)

