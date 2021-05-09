/** @jsxImportSource theme-ui */

import { Flex, Box, Button } from '@theme-ui/components'
import { useColorMode } from 'theme-ui'
import React from 'react'
import { NavLink, useHistory, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
    const { currentUser, currentOAuthUser, logout } = useAuth()
    const [colorMode, setColorMode] = useColorMode()
    const history = useHistory()

    const loggedIn = currentOAuthUser && currentUser

    const handleLoginButton = async (e) => {
        e.preventDefault()
        if (loggedIn) {
            await logout()
            history.push("/")
            return
        }
        history.push("/login")
    }

    const themeNames = [
        'light',
        'dark',
        'deep',
        'swiss'
    ]

    const toggleTheme = async (e) => {
        e.preventDefault()
        const i = themeNames.indexOf(colorMode) + 1
        setColorMode(themeNames[i % themeNames.length])
    }

    const toTitleCase = str => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    return (
        <Box bg="background" sx={{ height: "80px", width: "100%", alignItems: "center" }} css={{ position: "sticky", top: "0", zIndex: "9999" }}>
            <Flex bg="background" sx={{
                height: "100%",
                margin: "0 auto",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            >
                <Flex>
                    <RouterLink to="/" sx={{ variant: "styles.h2", textDecoration: "none", color: "text" }} css={{ cursor: "pointer" }}>
                        Smolberg
                    </RouterLink>
                </Flex>
                <Flex sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <NavLink to="/files" sx={{ variant: "links.nav", textAlign: "center", mr: "3", width: "100px"}}>
                        Files
                    </NavLink>
                    <Button mr={3} sx={{ height: "35px", width: "100px", verticalAlign: "middle", lineHeight: "initial" }} onClick={handleLoginButton}>{loggedIn ? "Log Out" : "Log In"}</Button>
                    <Button backgroundColor="gray" sx={{ height: "35px", width: "100px", verticalAlign: "middle", lineHeight: "initial" }} onClick={toggleTheme}>{toTitleCase(colorMode)}</Button>
                </Flex>
            </Flex>
        </Box>
    )
}
