import React, { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PrivateGameMenu from './GameMenus/PrivateGameMenu';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    introButtons: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(0),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },

    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    introTitle: {
        color: "black",
        "font-family": "Arial, cursive",
        "font-size": "4.7rem",
        "text-align": "center",
        marginBottom: theme.spacing(8)
    }
}));

function Intro() {
    const classes = useStyles();

    // initialize the states
    const [privateGameMenuOpen, setPrivateGameMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");

    // create api call to get the token
    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
        if (token) return;
        fetch(process.env.REACT_APP_API_ENDPOINT + '/getAnonymousToken')
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

    const isValidUsername = () => {
        if (!username) {
            setUsernameError(true);
            setUsernameErrorText("Please enter a name")
            return false;
        } else {
            return true;
        }
    }

    const closePrivateGameMenu = () => {
        setPrivateGameMenuOpen(false);
    }

    const handlePrivateGameClick = () => {
        if (isValidUsername()) {
            setPrivateGameMenuOpen(true);
        }
    }



    return (
        <div className={classes.heroContent}>
            <div>
                <Typography className={classes.introTitle}>Congregate</Typography>
            </div>
            <div>
                <form className={classes.centered} noValidate autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <FormControl error={usernameError}>
                        <OutlinedInput
                            id="username"
                            type='text'
                            placeholder='name'
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <FormHelperText id="username-error-text">{usernameErrorText}</FormHelperText>
                    </FormControl>
                </form>
                <div className={classes.centered}>
                    <Button 
                        className={classes.introButtons} 
                        variant="contained" 
                        color="primary"
                        onClick={e => {}}
                    >
                        Random Game
                    </Button>
                    <Button
                        className={classes.introButtons} 
                        variant="contained" 
                        color="primary"
                        onClick={e => handlePrivateGameClick()}
                    >
                        Private Game
                    </Button>
                </div>
                <div className={classes.centered}>
                    <Button className={classes.introButtons}>How to Play</Button>
                </div>
            </div>
            <PrivateGameMenu
                open={privateGameMenuOpen}
                username={username}
                closePrivateGameMenu={closePrivateGameMenu}
            />
        </div>
    );
}

export default Intro;