import { Button, Flex, Text } from '@theme-ui/components'
import React, { useState } from 'react'

// import { ReactComponent as TileButton } from '../../assets/ui-icons/tile.svg'
// import { ReactComponent as RowButton } from '../../assets/ui-icons/row.svg'
import { ReactComponent as UpArrow } from '../../assets/ui-icons/up-arrow.svg'
import RowView from './rowView'
import moment from 'moment'

const FileManager = ({ files, currentPath }) => {

    // const [currentView, setCurrentView] = useState('row')
    const [sortMode, setSortMode] = useState(localStorage.getItem('sort-pref') || 'lastMod-down')

    const sortedFiles = files

    if (sortMode === 'alpha-up') {
        sortedFiles.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase())
    } else if (sortMode === 'alpha-down') {
        sortedFiles.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase())
    } else if (sortMode === 'lastMod-down') {
        sortedFiles.sort((a, b) => moment(a.lastModTime).isBefore(moment(b.lastModTime)))
    } else {
        sortedFiles.sort((a, b) => moment(a.lastModTime).isAfter(moment(b.lastModTime)))
    }


    return (
        <Flex sx={{
            border: "solid",
            borderRadius: "10px",
            width: "80%",
            borderWidth: "2px",
            flexDirection: "column",
        }}>
            <Flex sx={{
                backgroundColor: "muted",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2
            }}>
                <Flex sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Button mr={3}>
                        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                            <UpArrow width="20px" height="20px" />
                        </Flex>
                    </Button>
                    <Text variant="subtitle">{currentPath}</Text>
                </Flex>
                <Flex>
                    <Button>
                        <Flex>
                            <Text>Add File</Text>
                        </Flex>
                    </Button>
                    {/* If we add a tile/icon view, these buttons will allow switching */}
                    {/* <Button mr={3} bg={currentView === 'tile' ? "default" : "gray"} onClick={(e) => setCurrentView('tile')}>
                        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                            <TileButton width="20px" height="20px" />
                        </Flex>
                    </Button> */}
                    {/* <Button bg={currentView === 'row' ? "default" : "gray"} onClick={(e) => setCurrentView('row')}>
                        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
                            <RowButton width="20px" height="20px" />
                        </Flex>
                    </Button> */}
                </Flex>
            </Flex>
            {/* {currentView === 'tile' ? <></> : <RowView files={sortedFiles} sort={sortMode} changeSort={setSortMode}/>} */}
            <RowView files={sortedFiles} sort={sortMode} changeSort={setSortMode}/>
        </Flex>
    )
}

export default FileManager