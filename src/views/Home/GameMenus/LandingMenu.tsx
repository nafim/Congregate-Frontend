import React from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    OutlinedInput,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MainMenuState } from './MainMenu';

const useStyles = makeStyles((theme) => ({
    introButtons: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface LandingMenuProps {
    username: string;
    usernameError: boolean;
    usernameErrorText: string;
    handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isValidUserName: () => boolean;
    handleStateChange: (newState: MainMenuState) => void;
}

function LandingMenu(props: LandingMenuProps) {
    const classes = useStyles();


    return(
        <div>
            <form className={classes.centered} noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <FormControl error={props.usernameError}>
                    <OutlinedInput
                        id="username"
                        type='text'
                        placeholder='name'
                        value={props.username}
                        onChange={props.handleUsernameChange}
                    />
                    <FormHelperText id="username-error-text">{props.usernameErrorText}</FormHelperText>
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
                    onClick={e => props.handleStateChange(MainMenuState.PrivateGame)}
                >
                    Private Game
                </Button>
            </div>
        </div>
    );
}

export default LandingMenu;