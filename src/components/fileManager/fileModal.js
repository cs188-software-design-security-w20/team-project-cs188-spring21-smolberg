/** @jsxImportSource theme-ui */

import { Flex, Text, Card, Close, Box, Button } from '@theme-ui/components'
import React, { useEffect } from 'react'
import moment from 'moment'
import FileIcon from './fileIcon';

const FileModal = ({ file, close }) => {

    useEffect(() => {
        const downHandler = ({ keyCode }) => {
            console.log(keyCode)
            if (keyCode === 27) {
                close()
            }
        }
        window.addEventListener("keydown", downHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [close]);

    console.log(file.lastModTime)

    return (
        <Flex sx={{
            position: "fixed",
            top: "0",
            left: '0',
            width: "100%",
            height: "100%",
            backgroundColor: "darken",
            zIndex: 10000,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Card bg="muted" opacity="1" p={4}>
                <Flex sx={{ flexDirection: 'column' }}>
                    <Flex sx={{ justifyContent: "flex-end" }}>
                        <Close onClick={close} sx={{ cursor: "pointer" }} />
                    </Flex>
                    <Flex mb={3} sx={{ flexDirection: "column", alignItems: "center"}}>
                        <Box mb={1}>
                            <FileIcon name={file.name} size="150px" />
                        </Box>
                        <Text variant="heading">{file.name}</Text>
                    </Flex>
                    <Text>Last Modified: {moment(file.lastModTime).format("MMM Do YYYY, h:mm:ss a")}</Text>
                    <Text>SHA-256 Sum: {file.sum}</Text>
                    <Flex mt={4} sx={{ justifyContent: "center" }}>
                        <Button mr={4}>Download</Button>
                        <Button>Delete</Button>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    )
}

export default FileModal