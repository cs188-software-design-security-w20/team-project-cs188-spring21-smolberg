import React, { useState, useContext, useEffect } from 'react'
import { favicon } from '../lib/misc';
import * as FileSaver from 'file-saver';
import fs from 'fs';

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
        // validate actual pwd
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

    const getData = async (fileId) => {
        const file = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            method: 'GET',
            headers: new Headers({ 'Authorization': 'Bearer ' + window.gapi.auth.getToken().access_token }),
        })
        return await file.arrayBuffer()
    }

    const download = async (fileId) => {
        setLoading(true)
        let filename = "file"
        let filetype = "txt"
        let request = window.gapi.client.drive.files.get({
            'fileId': fileId,
        });
        request.execute(function(file) {
            if (file.name) filename = file.name;
            if (file.mimeType) filetype = file.mimeType;
        });
        let data = await getData(fileId);
        const blob = new Blob([data], {type: filetype});
        FileSaver.saveAs(blob, filename);

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
        logout,
        download
    }

    return (
        <AuthContext.Provider value={authTools}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }