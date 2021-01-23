import React, { useState, useEffect } from 'react';
import {
    Button,
    IconButton,
    Toolbar,
    Box,
    Typography,
    Drawer,
    Hidden,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {VariableSizeList as MessageList} from 'react-window';
import classes from '*.module.sass';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
}));

function ChatInput() {
    const classes = useStyles();

    return(
        <TextField className={classes.root}
            id="outlined-multiline-static"
            multiline
            rows={3}
            placeholder="Type your message..."
            variant="outlined"
        />
    );
}

export default ChatInput;