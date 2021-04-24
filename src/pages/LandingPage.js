import React, { StrictMode, useEffect } from 'react'
import { useCookies } from 'react-cookie';

const LandingPage = () => {
    const [cookies, setCookie] = useCookies(['user']);
    let authorized = false;

    const checkAuth = () => {
        authorized = !authorized;
        console.log(authorized);
    }

    const checkCookie = () => {
        if (authorized && cookies['user'] !== 'undefined') {
            console.log(cookies['user'] + ' yay!');
        }
        else {
            console.log("boo");
        }
    }

    const makeCookie = (password) => {
        setCookie("user", password, {
            path: "/",
            maxAge: 60*60,
            secure: true,
            sameSite: 'strict',
        })
        console.log(`Made cookie ${password}`)
    }
    useEffect(() => {
        
    }, [authorized])

    return (
        <div>
            <h1>
                Landing Page
            </h1>
            <button onClick={checkAuth}>Toggle Auth</button>
            <button onClick={checkCookie}>Check Cookie</button>
            <form onSubmit={makeCookie('name')}>
                <label>
                    Password:
                    <input type="text" name="name" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default LandingPage

