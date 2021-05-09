/** @jsxImportSource theme-ui */

import React from 'react'
import Header from './Header'

const Container = (props) => {
    return (
        <>
            <Header />
            <div sx={{
                width: "80%",
                margin: "0 auto"
            }}>
                <>
                    {props.children}
                </>
            </div>
        </>
    )
}

export default Container