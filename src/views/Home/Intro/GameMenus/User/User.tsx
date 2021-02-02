import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { JWTPayload, Role } from '../../../../../api/HTTPRequests';
import SignIn from './SignIn';
import SignedIn from './SignedIn';

function User() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    const handleLogOut = () => {
        setLoggedIn(false);
    }

    const handleChangeUsername = (newUsername: string) => {
        setUsername(newUsername);
    }

    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
        // decide whether user is logged in based on token
        if (token) {
            const decoded = jwt_decode<JWTPayload>(token);
            if (decoded.role !== Role.Anonymous) {
                // check existing token is expired or not within margin of secondsBeforeExpire
                const now = Date.now().valueOf() / 1000;
                const secondsBeforeExpire = 1800;
                if (decoded.exp - now > secondsBeforeExpire) {
                    setLoggedIn(true);
                    setUsername(decoded.name);
                }
            }
        }
    },[])

    if (loggedIn) {
        return (
            <SignedIn
                username={username}
                handleLogOut={handleLogOut}
                handleChangeUsername={handleChangeUsername}
            />
        );
    } else {
        return (
            <SignIn />
        );
    }
}

export default User;