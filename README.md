# Mahjouba Riders Frontend

Frontend for craftsmen to find, accept, and complete (+ receive payment for) jobs to create parts for electric scooters built by the Mahjouba Initiative.

## App features

### Piece selection for craftsmen: 
The ability to search for jobs based on the materials they work with, see instructions, schematics, payment information & accept the job

<div align="center">
	<img width = "300" src="https://github.com/user-attachments/assets/a4c19880-b700-499c-a9bc-901aa4b1c336">
</div>

### Workshops 
are created and posted by the Mahjouba organization through the admin app! Here craftsmen can see, register, or unregister for local workshops on how to make parts

<div align="center">
	<img width = "300" src="https://github.com/user-attachments/assets/2a68fdfc-ab97-4cdb-b7ec-47d892317d86">
</div>

### Accessibility
Not all our target users can read English. We support English, French and Arabic and have voice support in all 3 languages. The Expo speech package aids this functionality

<div align="center">
	<img width = "300" src="https://github.com/user-attachments/assets/00b8fdb1-4bdf-4189-86d6-606f0ae1d45f">
</div>


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

<hr/>

Designed and developed by [@DALI Lab](https://github.com/dali-lab)

