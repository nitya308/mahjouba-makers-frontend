# mahjouba-makers-frontend

** TODO: Rename the repo. **

Frontend for craftsmen to accept and update the status of jobs undertaken for the Mahjouba Initiative.

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

### Style
[Describe notable code style conventions]

We are using [typically a configuration like [CS52's React-Native ESLint Configuration](https://gist.github.com/timofei7/c8df5cc69f44127afb48f5d1dffb6c84) or [CS52's ES6 and Node ESLint Configuration](https://gist.github.com/timofei7/21ac43d41e506429495c7368f0b40cc7)]

### File Structure
    .
    ├── ...    
    ├── public
    ├── src                
    │   └── assets             # static assets   
    │   └── components         # reusable components across several screens
    │   └── controllers        # controls subscreens of a given page
    │   └── hooks              # useAppDispatch, useAppSelector, useIsLoading
    │   └── navigation         # defines navigation flow
    │   └── redux              # Redux store and setup
    │   └── requests           # API calls + handling of backend
    │   └── screens            # individual pages
    │   └── types              # TS types
    │   └── utils              # utility folder containing helper files
    ├── tsconfig.json          # TypeScript configuration
    ├── package.json           # yarn config
    └── ...

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Setup Steps

Due to the native code being used in this project, we are using a bare Expo flow rather than a managed Expo flow; i.e., you need to run this thorugh the iOS simulator on MacOS rather than through the Expo mobile app scanning a QR code. (Sorry, Windows users - you're out of luck.)

1. clone repo and `yarn install`
   - We are using yarn because npm has issues with installing peer dependencies, which in turn causes issues when you eventually want to deploy to TestFlight
2. Change `SERVER_URL` endpoint depending on if you are using hosted backend or local backend
3. `cd ios` and `pod install`
4. `npx run-ios`, and the app should be ready for use
   - If the build fails, usually it is enough to try building the `.xcworkspace` file from XCode and fixing whatever error shows up based on XCode's recommendation
      - ![img](https://i.imgur.com/6WCL7Gd.png)

#### Redux Debugging

1. Download [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases) release
2. Run `.exe` file
3. Hook to port 19000

Note: Since Expo 67 switched the jsEngine from jsc to hermes, the React Native Debugger has been broken in most cases. However, since we are using a bare Expo flow, the [react-native-devsettings](https://github.com/gusgard/react-native-devsettings) package reenables the debugger. 

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into the main branch.

## Deployment
[TODO: Where is the app deployed? i.e. Expo, Surge, TestFlight etc.]

[TODO: What are the steps to re-deploy the project with any new changes?]

[TODO: How does one get access to the deployed project?]

## Authors
- 23F
   - Sid Hathi '24
   - Eric Lu '25
   - Josh Pfefferkorn '24
   - Brendan Berkman '24

## Acknowledgments
We would like to thank [anyone you would like to acknowledge] for [what you would like to acknowledge them for].

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)

### Template

- Eric Lu '25
