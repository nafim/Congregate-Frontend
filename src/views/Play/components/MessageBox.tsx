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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {VariableSizeList as MessageList} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    drawerPaper: {
        [theme.breakpoints.down('xs')]: {
            width: "100%",
        },
    },
    chatHeader: {
        display: "flex",
        backgroundColor: "#353536",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content below header to be below topBar
        ...theme.mixins.toolbar,
        justifyContent: "center"
    }
}));

const messages = [
    {messageText: "hello", user:"you"},
    {messageText: "hello", user:"you"},
    {messageText: "helloooo", user:"me"},
    {messageText: "hellooooo", user:"me"}
]

interface Message {
    messageText: string;
    user: string;
}

interface MessageProps {
    message: Message;
}

function MessageComponent(props: MessageProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography align='center' variant='caption' color='textSecondary'> {props.message.user} </Typography>
            <Typography variant='body1'> {props.message.messageText} </Typography>
        </div>
    )
}

function MessageBox() {
    return(
        <div>
            {messages.map((message: Message, idx: number) => {
                return(
                    <MessageComponent
                    message={message}
                    />
                );
            })}
        </div>
    );

}

export default MessageBox;

