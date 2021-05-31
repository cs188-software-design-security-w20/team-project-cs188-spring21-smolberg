# Smolberg

## Staging build

Our CI/CD environment will build all changes on our main branch. You can preview builds [here](https://smolberg.netlify.app/).

When you submit a PR, netlify will run build checks on your changes and also create a build preview website for you. The preview website will not work because the newly generated domain needs to be added to out Google API domain list. Once you do that, the preview will work.

## Whitelisting accounts

The build hosted [here](https://smolberg.netlify.app/) will only work with pre-approved Google accounts. To whitelist your account, open an issue on this project.

## Building

To build the website, first add a `.env` file in the project root. The file should contain your Google API keys. Make sure your GCP account has OAuth and Drive API enabled. The files contents will look like:
```
REACT_APP_GOOGLE_DRIVE_API_KEY=<KEY>
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=<SECRET>
```

Then run `yarn build` to build the project and then you can host the website.

## Contributing

Pre commit hooks and linters will ensure code correctness, quality and formatting.

## Available Scripts

In the project directory, you can run:

### `yarn start dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

You should not need to run this since our CI will do it for us.
