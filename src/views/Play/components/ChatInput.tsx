import React, { useEffect, useRef, useState } from 'react';
import {
    IconButton,
    TextField,
    InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
}));

interface ChatInputProps {
    addMessage: (messageText: string) => void;
    chatOpen: boolean;
}

function ChatInput(props: ChatInputProps) {
    const classes = useStyles();
    const [messageText, setMessageText] = useState("");
    const inputRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        props.addMessage(messageText);
        setMessageText("");
    }

    // set the focus to input when opening chat
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    },[props.chatOpen])

    return(
        <div className={classes.root}>
            <form noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}>
                <TextField
                    inputRef={inputRef}
                    id="chat-input"
                    multiline
                    fullWidth
                    autoFocus
                    rows={1}
                    rowsMax={2}
                    placeholder="Type your message..."
                    variant="outlined"
                    onChange={(evt) => setMessageText(evt.target.value)}
                    onKeyDown={(evt) => {
                        if (evt.key === 'Enter') {
                            evt.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    value={messageText}
                    InputProps={{
                        endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="send-message"
                            edge="end"
                            onClick={handleSendMessage}
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </form>
        </div>
    );
}

export default ChatInput;