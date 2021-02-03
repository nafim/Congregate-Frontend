import React from 'react';
import {
    AppBar,
    CircularProgress,
    Toolbar,
    Typography,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { disconnectSocket } from '../../api/GameSocket';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "flex-flow": "column",
        height: "100vh",
        width: "100vw"
    },
    title: {
        flexGrow: 1,
    },
    content: {
        height: "100%",
        display: "flex",
        alignItems: 'center'
    },
    loadingContainer: {
        width: "100%",
        display: "flex",
        justifyContent: 'center'
    }
}));

interface LoadingProps {
    loadingMessage: string;
}

function Loading(props: LoadingProps) {
    const classes = useStyles();
    const history = useHistory();

    const handleCancel = () => {
        disconnectSocket();
        history.push('/');
    }

    return (
        <div className={classes.root}>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            {props.loadingMessage}
                        </Typography>
                        <Button 
                            color="inherit"
                            onClick={e => handleCancel()}
                        >
                            Cancel
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.content}>
                <div className={classes.loadingContainer}>
                    <CircularProgress />
                </div>
            </div>
        </div>
    );
}

export default Loading;