import React, { useState } from 'react';
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
}

function ChatInput(props: ChatInputProps) {
    const classes = useStyles();
    const [messageText, setMessageText] = useState("");

    const handleSendMessage = () => {
        props.addMessage(messageText);
        setMessageText("");
    }

    return(
        <div className={classes.root}>
            <form noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}>
                <TextField
                    id="chat-input"
                    multiline
                    fullWidth
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