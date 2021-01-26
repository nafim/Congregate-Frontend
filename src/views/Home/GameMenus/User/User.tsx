import React, { useEffect, useState } from 'react';
import {
    Button, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import jwt_decode from 'jwt-decode';
import { JWTPayload, Role } from '../../../api/HTTPRequests';
import SignIn from './SignIn';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    introButtons: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

// interface UserProps {
//     handleStateChange: (newState: MainMenuState) => void;
// }

function User() {
    const classes = useStyles();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

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
            <Typography>
                Signed in as {username}
            </Typography>
        );
    } else {
        return (
            <SignIn />
        );
    }
}

export default User;