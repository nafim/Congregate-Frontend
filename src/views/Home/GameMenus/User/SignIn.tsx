import React, { useState } from 'react';
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
import { sendLoginEmail } from '../../../../api/HTTPRequests';

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
    },
    cancelButton: {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(1)
    }
}));

function SignIn() {
    const classes = useStyles();
    const [signIn, setSignIn] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailError(false);
        setEmailErrorText("");
    }

    const isValidEmail = () => {
        if (!email) {
            setEmailError(true);
            setEmailErrorText("Please enter a valid email")
            return false;
        } else {
            return true;
        }
    }

    const handleEnterEmail = () => {
        if (isValidEmail()) {
            sendLoginEmail(email)
            .then(data => {
                if (data.success) {
                    console.log(data.success);
                    setSignIn(false);
                    setEmail("");
                }
                if (data.error) console.error(data.error);
            })
            ;
        }
    }

    return(
        <div className={classes.root}>
            {!signIn && 
                <div className={classes.centered}>
                    <Button
                        className={classes.introButtons}
                        color='primary'
                        onClick={e => setSignIn(true)}
                    >
                        Sign in to save progress
                    </Button>
                </div>
            }
            {signIn && 
                <div>
                    <Typography variant='subtitle1' align='center' color='textSecondary'>
                        Sign in with email:
                    </Typography>
                    <form className={classes.centered} noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        handleEnterEmail();
                    }}>
                        <FormControl error={emailError}>
                            <OutlinedInput
                                id="gameID"
                                type='text'
                                placeholder='email'
                                value={email}
                                onChange={handleEmailChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="submit login info"
                                        edge="end"
                                        onClick={handleEnterEmail}
                                        >
                                            <ArrowForward />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText id="email-error-text">{emailErrorText}</FormHelperText>
                        </FormControl>
                    </form>
                    <div className={classes.centered}>
                        <Button
                            className={classes.cancelButton} 
                            color="secondary"
                            onClick={e => setSignIn(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default SignIn;