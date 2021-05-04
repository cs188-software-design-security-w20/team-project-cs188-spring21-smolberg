/** @jsxImportSource theme-ui */

import { Flex } from '@theme-ui/components'
import React from 'react'
import Container from '../components/Container'
import FileManager from '../components/fileManager'

import sampleFiles from '../components/fileManager/sampleFiles'

const Files = () => {
    return (
        <Container>
            <Flex mt={2} sx={{width: "100%", justifyContent: "center"}}>
                <FileManager files={sampleFiles} currentPath="/users/testuser" />
            </Flex>
        </Container>
    )
}

export default Files