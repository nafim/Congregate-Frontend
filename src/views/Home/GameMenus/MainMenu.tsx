import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LandingMenu from './LandingMenu';
import PrivateGameMenu from './PrivateGameMenu';
import JoinGame from './JoinGame';
import CreateGame from './CreateGame';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2,2,0),
        display: 'inline-flex',
    },
}));

export enum MainMenuState {
    LandingMenu = 1,
    RandomGame,
    PrivateGame,
    CreateGame,
    JoinGame,
    Ready,
}

function MainMenu() {
    const classes = useStyles();

    // initialize the states
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");
    const [menuState, setMenuState] = useState(MainMenuState.LandingMenu);

    // create api call to get the token
    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
        if (token) return;
        fetch(process.env.REACT_APP_API_BACKEND + '/api/getAnonymousToken')
        .then(res => res.json())
        .then(data => {
            if (data.error) throw Error(data.error);
            localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
        })
        .catch(err => console.error(err))
    })
    
    // create handlers
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setUsernameError(false);
        setUsernameErrorText("");
    }
    const handleStateChange = (newState: MainMenuState) => {
        setMenuState(newState);
    }

    const isValidUsername = () => {
        if (!username) {
            setUsernameError(true);
            setUsernameErrorText("Please enter a name")
            return false;
        } else {
            return true;
        }
    }

    // different menu content
    switch (menuState) {
        case MainMenuState.LandingMenu:
            return (
                <div className={classes.root}>
                    <LandingMenu 
                        username={username}
                        usernameError={usernameError}
                        usernameErrorText={usernameErrorText}
                        handleUsernameChange={handleUsernameChange}
                        isValidUserName={isValidUsername}
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.PrivateGame:
            return (
                <div className={classes.root}>
                    <PrivateGameMenu
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.CreateGame:
            return (
                <div className={classes.root}>
                    <CreateGame
                        username={username}
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.JoinGame:
            return (
                <div className={classes.root}>
                    <JoinGame
                        username={username}
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.Ready:
            return(<Redirect to="/play" />);
        default:
            return (
                <div className={classes.root}>
                    {"Something went wrong!"}
                </div>
            );
    }
}

export default MainMenu;