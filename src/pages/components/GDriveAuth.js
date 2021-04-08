import {Component} from 'react'
import { gapi } from 'gapi-script';
// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
class GDriveAuth extends Component {
    constructor(props) {
        super(props)
        this.state = { username: undefined }
    }
    updateSigninStatus = (data) => {
        console.log(data)
    }

    handleClientLoad = () => {
        gapi.load('client:auth2', () => {
            gapi.client
              .init({
                'apiKey': process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
                'clientId': process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
                'scope': SCOPES,
                'discoveryDocs': DISCOVERY_DOCS
              })
              .then(
                function () {
                    console.log('hehe')
                    var GoogleAuth = gapi.auth2.getAuthInstance();
                    GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
                },
                function (error) {console.log(error)}
              );
          });
    };

    // initClient = async 
    render () {
      return <div>
        <button onClick={() => this.handleClientLoad()}>
            authenticate
        </button>
      </div>
    }
  }

export default GDriveAuth