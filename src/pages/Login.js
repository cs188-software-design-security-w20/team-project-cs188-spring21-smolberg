import { Flex, Label, Input, Box, Button } from '@theme-ui/components'
import React from 'react'
import Container from '../components/Container'
import { useAuth } from '../contexts/AuthContext'
import useInput from '../hooks/useInput'

const Login = () => {

    const { login } = useAuth()

    const usernameInput = useInput('')
    const passwordInput = useInput('')

    const handleLogin = (e) => {
        e.preventDefault()
        login(usernameInput.v, passwordInput.v)
    }

    return (
        <Container>
            <Flex as="form" sx={{ flexDirection: "column", width: "240px" }} onSubmit={handleLogin}>
                <Box>
                    <Label>Username</Label>
                    <Input {...usernameInput.bind}></Input>
                </Box>
                <Box mb={2}>
                    <Label>Password</Label>
                    <Input type="password" {...passwordInput.bind}></Input>
                </Box>
                <Button>Login</Button>
            </Flex>
        </Container>
    )
}

export default Login