/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@theme-ui/components'
import Container from '../components/Container'
import FileManager from '../components/fileManager'
import {getAllFileData, formatFiles} from '../lib/gdrivefs/files.js' 

class Files extends React.Component {
    constructor(props) {
        super(props)
        this.state = { files: [] }
    }

    componentDidMount(){
        this.handleInit()
    }

    handleInit = async () => {
        const r = await formatFiles(
            await getAllFileData())
            // fakeGDrive) *** KEEP HERE FOR DEBUG
        this.setState({files: r})
    }

    render () {
        const {files} = this.state;
        return <div>
            <Container>
                <Flex mt={2} sx={{ width: "100%", justifyContent: "center" }}>
                    <FileManager files={files}/>
                </Flex>
            </Container>
        </div>
    }
  }

export default Files