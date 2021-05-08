import React, { useState, useContext, useEffect } from 'react'

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

    // TODO: Make this a null init. Right now this override helps testing
    const [currentUser, setCurrentUser] = useState('eruighfu')
    // Don't render anything before auth status has been realized
    // Probably won't need this, except on the pages first load. For now it shouldn't mess anything up
    const [loading, setLoading] = useState(false)

    const updateOauthStatus = (isSignedIn) => {
        if (!isSignedIn) {
            window.gapi.auth2.getAuthInstance().signIn()
            return
        }
        setCurrentUser({
            oauth: window.gapi.auth2.getAuthInstance().currentUser,
            ...currentUser
        })
    }

    useEffect(() => {
        setLoading(true)
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                'apiKey': process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
                'clientId': process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
                'scope': SCOPES,
                'discoveryDocs': DISCOVERY_DOCS
            }).then(() => {
                window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                    if (!isSignedIn) {
                        window.gapi.auth2.getAuthInstance().signIn()
                        return
                    }
                    setCurrentUser({
                        oauth: window.gapi.auth2.getAuthInstance().currentUser,
                        ...currentUser
                    })
                })
                if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    setCurrentUser({
                        oauth: window.gapi.auth2.getAuthInstance().currentUser,
                        ...currentUser
                    })
                }
            }, (e) => console.log(e.details))
        })
        setLoading(false)
    }, [currentUser])

    const signup = () => {
        setLoading(true)
        // TODO
        setLoading(false)
    }
    console.log(window.gapi)

    const updateOauthStatus = (isSignedIn) => {
        if (!isSignedIn) {
            window.gapi.auth2.getAuthInstance().signIn()
            return
        }
        setCurrentUser({
            oauth: window.gapi.auth2.getAuthInstance().currentUser,
            ...currentUser
        })
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
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateOauthStatus)
                updateOauthStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
            }, (e) => console.log(e.details))
        })
        setLoading(false)
    }

    const login = (user, pass) => {
        setLoading(true)
        updateOauthStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
        // validate actual pwd
        // setCurrentUser(---user obj---)
        // TODO
        setLoading(false)
    }

    const logout = () => {
        setLoading(true)
        setCurrentUser(null)
        window.gapi.auth2.getAuthInstance().signOut()
        setLoading(false)
    }

    const authTools = {
        currentUser,
        gapiLoad,
        login,
        signup,
        logout
    }

    return (
        <AuthContext.Provider value={authTools}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuth }