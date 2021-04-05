import React, { useState, useContext } from 'react'

const AuthCtx = React.createContext()

/**
 * 
 * This section always logs someone in but we will change it later
 *  
 */

const useAuth = () => {
    return useContext(AuthCtx)
}

const AuthContext = ( { children } ) => {

    const [currentUser, setCurrentUser] = useState()
    // TODO: Change this to true when auth logic is implemented
    const [loading, setLoading] = useState(false)

    const vals = {
        currentUser
    }

    return (
        <AuthCtx.Provider value={vals}>
            {!loading && children}
        </AuthCtx.Provider>
    )
}

export { AuthContext, useAuth }