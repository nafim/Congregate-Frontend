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
import { sendLoginEmail } from '../../../../../api/HTTPRequests';
import { useSnackbar } from 'notistack';
import constants from '../../../../../constants';


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
    const { enqueueSnackbar } = useSnackbar();

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
            setEmailErrorText("Invalid email")
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
                    enqueueSnackbar("A verification email has been sent to your address", { 
                        variant: 'success',
                    })
                    setSignIn(false);
                    return setEmail("");
                }
                if (data.errors.length > 0) {
                    const error = data.errors[0];
                    // if problem is in the email
                    if (error.param === 'email') {
                        setEmailError(true);
                        setEmailErrorText(error.msg);
                    // if problem is rate-limiting
                    } else if (error.param === 'rate-limit') {
                        setSignIn(false);
                        setEmail("");
                        enqueueSnackbar(error.msg, { 
                            variant: 'error',
                        })
                    // if problem is something else
                    } else {
                        enqueueSnackbar(constants.ERROR_MESSAGE, { 
                            variant: 'error',
                        })
                    }
                };
            })
            .catch(error => {
                setSignIn(false);
                setEmail("");
                enqueueSnackbar(constants.ERROR_MESSAGE, { 
                    variant: 'error',
                })
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