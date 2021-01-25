import io from 'socket.io-client';
let socket: SocketIOClient.Socket;

// Initiate socket connection
export const initiateSocket = (authToken: string, gameID?: string, cb?: () => void) => {
    socket = io(process.env.REACT_APP_API_BACKEND!, {
        query: gameID ? { gameID } : undefined,
        // @ts-ignore
        auth: {
            token: authToken
        }
    });
    if (cb) {
        socket.on('connect', cb);
    }
    socket.on('connect_error', (err: any) => {
        console.log(err.message);
    });
    console.log('Connecting to socket...');
    socket.on('disconnect', () => {
        console.log('Disconnecting socket...');
    })
}

export const isSocketConnected = () => {
    if (socket) return socket.connected;
    return false;
}

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

//////////////////////////////////////////////////////
///////////////// Game communication /////////////////
//////////////////////////////////////////////////////

export interface GamePosition {
    lat: number;
    lng: number;
}

export interface GameUpdateData {
    pos: GamePosition
}

export enum GameStatus {
    InLobby = "InLobby", // when waiting for other player
    Starting = "Starting", // game is starting in 3 seconds
    InProgress = "InProgress", // game in progress
    Win = "Win", // players found each other
    Loss = "Loss", // players ran out of time
}

// game status data object definition
export interface GameStatusData {
    status: GameStatus
    timeRemaining: number // in seconds
    score: number // cumulative score after each game
}

// when successfully matched in random game, this event is sent
export interface MatchSuccessData {
    gameID: string
}

// emit ready status
export const sendPlayerReady = () => {
    if (socket) socket.emit('playerReady');
}

// emit updated game info
export const sendGameUpdate = (gameUpdateData: GameUpdateData) => {
    if (socket) socket.emit('gameUpdate', gameUpdateData);
}

// on game start an initial position will be given
export const subscribeToInitialPosition = (cb: (data: GameUpdateData) => void) => {
    if (!socket) return false;
    socket.on('initialPosition', cb);
    return true;
}

// Subscribe to game status updates
export const subscribeToGameStatus = (cb: (data: GameStatusData) => void) => {
    if (!socket) return false;
    socket.on('gameStatus', cb);
    return true;
}

export const subscribeToMatchSuccess = (cb: (data: MatchSuccessData) => void) => {
    if (!socket) return false;
    socket.on('matchSuccess', cb);
    return true;
}

//////////////////////////////////////////////////////
///////////////// Chat communication /////////////////
//////////////////////////////////////////////////////

// message data object definition
export interface MessageEventData {
    text: string
    name: string
    timestamp: number // milliseconds since Unix epoch
}

// emit message data
export const sendMessage = (messageText: string) => {
    const messageData: MessageEventData = {
        text: messageText,
        name: 'John',
        timestamp: Date.now()
    };
    if (socket) socket.emit('message', messageData);
}

// receiving messages from other userss
export const subscribeToMessage = (cb: (data: MessageEventData) => void) => {
    if (!socket) return false;
    socket.on('message', cb);
    return true;
}


