# CRUD Template - Mobile Frontend - Expo - Redux Toolkit

This repository is an optional frontend starter for new DALI React projects. Installation and setup instructions are included below. You should eventually customize this README file with project-specific documentation.

## Designs

[Screenshot description]

[Link to the project Figma]()

[2-4 screenshots from the app]

## Architecture
### Tech Stack
- [Expo Go](https://expo.dev/client)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [axios](https://github.com/axios/axios)
- [TypeScript](https://www.typescriptlang.org/docs/)

#### External Packages
- [Description of any notable added services]

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
    │   └── hooks              # useAppDispatch, useAppSelector
    │   └── navigation         # defines navigation flow
    │   └── redux              # Redux store and setup
    │   └── screens            # individual pages
    │   └── types              # TS types
    │   └── utils              # utility folder containing helper files
    ├── tsconfig.json          # TypeScript configuration
    ├── package.json           # yarn config
    └── ...

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Setup Steps (example)

1. clone repo and `yarn install`
   - We are using yarn because npm has issues with installing peer dependencies, which in turn causes issues when you eventually want to deploy to TestFlight
2. Change `SERVER_URL` endpoint to exact IPv4 address + port used by backend
   - You can view your IPv4 address by running `ipconfig` in command terminal
3. App should be ready for use now
   - `yarn start` to run with hot reloading
      - If you are getting "This is taking much longer than it should..." error, try doing `expo start --tunnel` instead. This error happens sometimes when trying to run on Dartmouth eduroam.

#### Redux Debugging

1. Download [react-native-debugger](https://github.com/jhen0409/react-native-debugger/releases) release
2. Run `.exe` file
3. Hook to port 19000

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into master.

## Deployment
[Where is the app deployed? i.e. Expo, Surge, TestFlight etc.]

[What are the steps to re-deploy the project with any new changes?]

[How does one get access to the deployed project?]

## Authors
* Firstname Lastname 'YY, role

## Acknowledgments
We would like to thank [anyone you would like to acknowledge] for [what you would like to acknowledge them for].

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)

### Template

- Eric Lu '25
