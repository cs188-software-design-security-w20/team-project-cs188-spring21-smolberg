import React, { useState, useContext, useEffect } from 'react';
import { favicon } from '../lib/misc';
import * as bcrypt from 'bcryptjs';

const AuthContext = React.createContext()

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 * 
 * This section always logs someone in but we will change it later
 *  
 */

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {

    const [currentOAuthUser, setCurrentOAuthUser] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    // Don't render anything before auth status has been realized
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const f = async () => {
            await window.gapi.load('client:auth2', () => {
                window.gapi.client.init({
                    'apiKey': process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
                    'clientId': process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
                    'scope': SCOPES,
                    'discoveryDocs': DISCOVERY_DOCS
                }).then(() => {
                    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        setCurrentOAuthUser(window.gapi.auth2.getAuthInstance().currentUser)
                    }
                }, (e) => console.log(e.details))
            })
        }
        f()
        setLoading(false)
    }, [])

    const setLockedFavicon = () => favicon.changeFavicon('locked.png')
    const setUnlockedFavicon = () => favicon.changeFavicon('unlocked.png')

    const signup = () => {
        setLoading(true)
        // TODO
        setLoading(false)
    }

    const updateOAuthStatus = async (isSignedIn) => {
        if (!isSignedIn) {
            try {
                await window.gapi.auth2.getAuthInstance().signIn()
            } catch {
                throw Error()
            }
        }
        setCurrentOAuthUser(window.gapi.auth2.getAuthInstance().currentUser)
    }

    const gapiLoad = async () => {
        setLoading(true)
        await window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                'apiKey': process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
                'clientId': process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
                'scope': SCOPES,
                'discoveryDocs': DISCOVERY_DOCS
            }).then(() => {
                // window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateOAuthStatus)
                updateOAuthStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
            }, (e) => console.log(e.details))
        })
        setLoading(false)
    }

    const loginOAuth = async () => {
        try {
            await updateOAuthStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
        } catch {
            throw Error()
        }
    }

    const OAuthLogOut = async () => {
        await window.gapi.auth2.getAuthInstance().signOut()
        setCurrentOAuthUser(null)
    }

    const login = (pass) => {
        setLoading(true)

        // Double check that OAuth is still valid?


        // Password Validation

        
        // TODO: determine if new user by accessing manifest


        let newUser = true;
        var hash = '';

        // Save user password hash if not enrolled

        if (newUser) {

            // Generate salt and hash
            var salt = bcrypt.genSaltSync(10); // TODO: is random salt okay?
            hash = bcrypt.hashSync(pass, salt);

            // Testing
            console.log("Password: " + pass);
            console.log("Hash: " + hash);
            console.log("Status: " + bcrypt.compareSync(pass, hash));

            // Upload to Google Drive
            // Store salt with hash?
            const boundary='foo_bar_baz'
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            var fileName='manifest.json'; 
            var username = "hi";
            var fileData='{ Username: "' + username + '", Hash: "' + hash + '", Salt: "' + salt + '" }';

            // TODO: encrypt file data before uploading to drive

            var contentType='application/json'
            var metadata = {
              'name': fileName,
              'mimeType': contentType
            };

            var multipartRequestBody =
              delimiter +
              'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: ' + contentType + '\r\n\r\n' +
              fileData+'\r\n'+
              close_delim;

          console.log(multipartRequestBody);
          var request = window.gapi.client.request({
            'path': 'https://www.googleapis.com/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/related; boundary=' + boundary + ''
            },
            'body': multipartRequestBody});
            request.execute(function(file) {
              console.log(file)
            });

            // TODO: Upload this data to user local cookies

        } else {
            // TODO: Get hashed password from user manifest


            hash = 'hi';
            bcrypt.compareSync(pass, hash);
        }

        // setCurrentUser(---user obj---)

        // TODO
        setUnlockedFavicon()
        setLoading(false)
    }

    const logout = async () => {
        setLoading(true)
        await OAuthLogOut()
        setCurrentUser(null)
        setLockedFavicon()
        setLoading(false)
    }

    const authTools = {
        currentUser,
        currentOAuthUser,
        gapiLoad,
        login,
        loginOAuth,
        signup,
        OAuthLogOut,
        logout
    }

    return (
        <AuthContext.Provider value={authTools}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }