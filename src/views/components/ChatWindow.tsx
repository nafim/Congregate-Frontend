import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Typography,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MessageBox from './MessageBox';
import ChatInput from './ChatInput';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: "100%"
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    drawerPaper: {
        width: drawerWidth,
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

interface ChatWindowProps {
    chatOpen: boolean
    handleChatToggle: () => void
}


function ChatWindow(props: ChatWindowProps) {
    const classes = useStyles();

    return (
        <nav aria-label="chat window">
            <Drawer
                variant="persistent"
                anchor="right"
                open={props.chatOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.chatHeader}>
                    <Typography style={{color: "white"}} variant='h6' align='center'> Chat </Typography>
                    <IconButton onClick={props.handleChatToggle}>
                        <ChevronRightIcon style={{color: 'white'}} />
                    </IconButton>
                </div>
                <MessageBox />
                <ChatInput />
            </Drawer>
        </nav>
    );
}

export default ChatWindow;