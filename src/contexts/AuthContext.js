import React, { useState, useContext } from 'react'

const AuthContext = React.createContext()

/**
 * 
 * This section always logs someone in but we will change it later
 *  
 */

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ( { children } ) => {

    // TODO: Make this a null init. Right now this override helps testing
    const [currentUser, setCurrentUser] = useState('f')
    // Don't render anything before auth status has been realized
    // Probably won't need this, except on the pages first load. For now it shouldn't mess anything up
    const [loading, setLoading] = useState(false)

    const signup = () => {
        setLoading(true)
        // TODO
        setLoading(false)
    }

    const login = (a) => {
        setLoading(true)
        // setCurrentUser(---user obj---)
        // TODO
        console.log(a)
        setLoading(false)
    }

    const logout = () => {
        setLoading(true)
        setCurrentUser(null)
        // TODO
        setLoading(false)
    }

    const authTools = {
        currentUser,
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