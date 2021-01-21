import React from 'react';
import {
    AppBar,
    CircularProgress,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

function Loading() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <AppBar style={{backgroundColor: "#4a4a50"}} position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            Loading...
                        </Typography>
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