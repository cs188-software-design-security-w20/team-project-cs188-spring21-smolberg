import { Flex, Text, Box, Button } from '@theme-ui/components'
import React from 'react'
import Container from '../components/Container'

import { ReactComponent as EncryptedFileLogo } from '../assets/ui-icons/envelope.svg'
import constants from '../constants'

const LandingPage = () => {
    return (
        <Container>
            <Flex sx={{ flexDirection: "column" }}>
                <Text mt={4} sx={{ fontSize: 70 }}>Take back control of your data.</Text>
                <Flex mt={4} sx={{ justifyContent: "flex-start" }}>
                    <Box sx={{flexShrink: "0"}}>
                        <EncryptedFileLogo width="330px" height="330px" />
                    </Box>
                    <Flex ml={5} sx={{ flexDirection: "column" }}>
                        <Text mb={3} sx={{ fontSize: 36 }}>Encrypt you files and store them securely in Google Drive</Text>
                        <Text mb={2}>
                            Connect {constants.APP_NAME} to your Google Drive and use your Drive as an encrypted cloud file storage location. {constants.APP_NAME} will encrypt your files using best in class file encryption methods and store them in a folder
                            on your Google Drive.
                        </Text>
                        <Text mb={2}>
                            {constants.APP_NAME} does not store your data on any servers. All of your data, including information needed for secure logins, is stored exclusively
                            on your Google Drive. All data will be encrypted and can only be unlocked with your master password.
                        </Text>
                        <Flex sx={{ justifyContent: "center" }}>
                            <Button sx={{ width: "30%" }}>
                                Get Started
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Container>
    )
}

export default LandingPage

