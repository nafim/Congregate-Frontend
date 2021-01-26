import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';
import { getUserToken } from '../api/HTTPRequests';
import { useHistory, useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    menuContainer: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2,2,0),
        display: 'inline-flex',
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
    const query = new URLSearchParams(useLocation().search);
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setUsernameError(false);
        setUsernameErrorText("");
    }

    const isValidUsername = () => {
        if (!username) {
            setUsernameError(true);
            setUsernameErrorText("Please enter a valid Username")
            return false;
        } else {
            return true;
        }
    }

    const handleEnterUsername = () => {
        if (isValidUsername()) {
            getUserToken(username, query.get("key")!);
        }
    }

    useEffect(() => {
        // if theres no query key, then 
        if (!query.get("key")) {
            history.push('/');
        }
    },[])

    return (
        <div className={classes.heroContent}>
            <div>
                <Typography className={classes.introTitle}>Congregate</Typography>
            </div>
            <div className={classes.centered}>
                <div className={classes.menuContainer}>
                    <div>
                        <Typography variant='subtitle1' align='center' color='textSecondary'>
                            Enter your username:
                        </Typography>
                        <form noValidate autoComplete="off" onSubmit={(e) => {
                            e.preventDefault();
                            handleEnterUsername();
                        }}>
                            <FormControl error={usernameError}>
                                <OutlinedInput
                                    id="gameID"
                                    type='text'
                                    placeholder='Username'
                                    value={username}
                                    onChange={handleUsernameChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="submit login info"
                                            edge="end"
                                            onClick={handleEnterUsername}
                                            >
                                                <ArrowForward />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText id="username-error-text">{usernameErrorText}</FormHelperText>
                            </FormControl>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Intro;