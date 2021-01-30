import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { JWTPayload, Role } from '../../../../api/HTTPRequests';
import SignIn from './SignIn';
import SignedIn from './SignedIn';

function User() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    const handleLogOut = () => {
        setLoggedIn(false);
    }

    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
        if (token) {
            const decoded = jwt_decode<JWTPayload>(token);
            if (decoded.role !== Role.Anonymous) {
                setLoggedIn(true);
                setUsername(decoded.name);
            }
        }
    },[])

    if (loggedIn) {
        return (
            <SignedIn
                username={username}
                handleLogOut={handleLogOut}
            />
        );
    } else {
        return (
            <SignIn />
        );
    }
}

export default User;