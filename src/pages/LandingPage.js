import React from 'react'
import Container from '../components/Container'
import { useCookies } from 'react-cookie';

const LandingPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    let authorized = false;

    // toggle 'authorized'
    const checkAuth = () => {
        authorized = !authorized;
        console.log(authorized);
    }

    // check if a cookie exists
    const checkCookie = () => {
        if (authorized) {
            if (cookies.user !== 'undefined')
                console.log(`user cookie: ${cookies['user']}`);
            else
                makeCookie("default");
        }
        else {
            console.log("unauthorized");
        }
    }

    // make a new cookie
    const makeCookie = (password) => {
        setCookie("user", password, {
            path: "/",
            maxAge: 60*60,
            secure: true,
            sameSite: 'strict',
        })
        console.log(`Made cookie ${password}`)
    }

    // check if cookie is valid
    const validCookie = () => {
        if (cookies['user'] !== 'yes') {
            console.log("Invalid cookie, creating new one");
            removeCookie("user")
            makeCookie("yes");
        }
    }

    // temp button handler
    const handleSubmit = (event) => {
        event.preventDefault()
        const password = event.target[0].value;
        makeCookie(password);
    }
    // useEffect(() => {
        
    // }, [authorized])

    return (
        <Container>
            <h1>
                Landing Page
            </h1>
            <button onClick={checkAuth}>Toggle Auth</button>
            <button onClick={checkCookie}>Get Cookie</button>
            <button onClick={validCookie}>Valid Cookie</button>
            <form onSubmit={handleSubmit}>
                <label>
                    Password:
                    <input type="text" name="name" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </Container>
    )
}

export default LandingPage

