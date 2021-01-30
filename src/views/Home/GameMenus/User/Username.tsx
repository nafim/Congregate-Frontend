import React, { useEffect, useState } from 'react';
import {
    FormControl,
    FormHelperText,
    TextField,
    IconButton,
    InputAdornment,
    Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForward from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
    item: {
        margin: theme.spacing(0, 0, 1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameForm: {
        margin: theme.spacing(0, 0, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameTitle: {
        display: 'flex',
        margin: theme.spacing(0, 5, 1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
}));

interface UsernameProps {
    username: string;
}

function Username(props: UsernameProps) {
    const classes = useStyles();
    const [changeUsername, setChangeUsername] = useState(false);

    const [newUsername, setNewUsername] = useState(props.username);
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");

    const handleEnterUsername = () => {
        setChangeUsername(false);
    }
    
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUsername(event.target.value);
        setUsernameError(false);
        setUsernameErrorText("");
    }

    return(
            <div>
                {!changeUsername &&
                <div className={classes.usernameTitle} >
                    <Typography 
                        variant='h6' 
                        color='textSecondary'
                    >
                        {props.username}
                    </Typography>
                    <IconButton
                        aria-label="change username"
                        edge="end"
                        onClick={() => setChangeUsername(true)}
                        >
                            <EditIcon style={{ fontSize: 18 }} />
                    </IconButton>
                </div>
            }
            {changeUsername &&
                <div className={classes.usernameForm}>
                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        handleEnterUsername();
                    }}>
                        <FormControl error={usernameError}>
                            <TextField
                                id="newUsername"
                                label='Change Username'
                                value={newUsername}
                                size="small"
                                onChange={handleFormChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="change username"
                                            edge="end"
                                            onClick={handleEnterUsername}
                                            >
                                                <ArrowForward />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <FormHelperText id="username-error-text">{usernameErrorText}</FormHelperText>
                        </FormControl>
                    </form>
                </div>
            }
            </div>
    );
}

export default Username;