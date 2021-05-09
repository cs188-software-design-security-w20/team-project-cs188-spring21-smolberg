import { Flex, Input, Button, Text, Card, Image, IconButton, Link } from '@theme-ui/components'
import React, { useState } from 'react'
import Container from '../components/Container'
import { useAuth } from '../contexts/AuthContext'
import useInput from '../hooks/useInput'

import googleLogo from '../assets/logos/google_mini.svg'

const PageIndicatorButton = (props) => {
    return <IconButton aria-label="Toggle dark mode" enabled={false} onClick={props.onClick} sx={{ cursor: "pointer" }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentcolor">
            <circle
                r={11}
                cx={12}
                cy={12}
                fill={props.active ? "primary" : "none"}
                stroke="currentColor"
                strokeWidth={2}
            />
        </svg>
    </IconButton>
}

const OAuthWindow = (props) => {

    const swapAccount = () => {
        props.OAuthLogOut()
        props.setComplete(false)
    }

    const handleClick = async () => {
        try {
            await props.handleOAuthLogin()
            props.setComplete(true)
            setTimeout(() => props.movePage(), 500)
        } catch {
            props.setComplete(false)
        }
    }

    return (
        <Flex sx={{
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            textAlign: "center"
        }}>
            <Text variant="subheading" mt={2} mb={2}>Connect to Google Drive</Text>
            <Text mb={2}>Connect your Google account so this app can access your drive</Text>
            <Flex sx={{ height: "100%", width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <Button variant="black" mb={2} onClick={handleClick} disabled={props.currentOAuthUser != null}
                    sx={{
                        cursor: props.currentOAuthUser ? "not-allowed" : "pointer",
                        width: "60%",
                        height: "50px"
                    }}>
                    <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Image src={googleLogo} sx={{
                            width: 35,
                            height: 35,
                            borderRadius: 99999,
                        }} />
                        <Text>Sign in with Google</Text>
                    </Flex>
                </Button>
                {props.currentOAuthUser && <Text>You are signed in to Google. <Link onClick={swapAccount}>Click here</Link> to sign out or change your account</Text>}
            </Flex>
        </Flex>
    )
}

const MPWWindow = (props) => {
    return (
        <Flex sx={{
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            textAlign: "center"
        }}>
            <Text variant="subheading" mt={2} mb={2}>Enter your Master Password</Text>
            <Text mb={2}>Verify your master password, so we can encrypt and decrypt your documents</Text>
            <Flex sx={{ height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <Input mb={2} type="password" {...props.passwordInput.bind}></Input>
                <Button onClick={props.handleLogin}>Login</Button>
            </Flex>
        </Flex>
    )
}

const Login = () => {
    const { currentOAuthUser, loginOAuth, OAuthLogOut } = useAuth()
    const [currentPage, setCurrentPage] = useState(currentOAuthUser ? 2 : 1)
    const [canEnterPwd, setCanEnterPwd] = useState(currentOAuthUser != null)
    const passwordInput = useInput('')

    const handleOAuthLogin = async () => {
        try {
            await loginOAuth()
        } catch {
            throw Error()
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
    }

    return (
        <Container>
            <Flex sx={{ justifyContent: "center" }}>
                <Card mt={4} sx={{ height: "300px", width: "500px" }}>
                    <Flex sx={{ height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                        {currentPage === 1
                            ? <OAuthWindow handleOAuthLogin={handleOAuthLogin}
                                currentOAuthUser={currentOAuthUser}
                                OAuthLogOut={OAuthLogOut}
                                movePage={() => setCurrentPage(2)}
                                setComplete={(v) => setCanEnterPwd(v)} />
                            : <MPWWindow handleLogin={handleLogin} passwordInput={passwordInput} />}
                        <Flex sx={{ width: "20%", justifyContent: "space-evenly" }}>
                            <PageIndicatorButton active={currentPage === 1} onClick={() => setCurrentPage(1)} />
                            <PageIndicatorButton active={currentPage === 2} onClick={() => { if (canEnterPwd) setCurrentPage(2) }} />
                        </Flex>
                    </Flex>
                </Card>
            </Flex>
        </Container>
    )
}

export default Login