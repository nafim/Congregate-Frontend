const io = require("socket.io-client");
let socket: SocketIOClient.Socket;

// Initiate 
export const initiateSocket = (room: string, username: string, authToken: string, cb: () => void) => {
    socket = io(process.env.REACT_APP_BACKEND_URL, {
        query: { room, username },
        auth: {
            token: authToken
        }
    });
    socket.on('connect', cb);
    console.log('Connecting to socket...');
    socket.on('disconnect', () => {
        console.log('Disconnecting socket...');
    })
}

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

export interface GameUpdateData {
    pos: {
        lat: number,
        lng: number
    }
}

// emit updated game info
export const sendGameUpdate = (gameUpdateData: GameUpdateData) => {
    if (socket) socket.emit('gameUpdate', gameUpdateData);
}

// emit ready status
export const sendPlayerReady = () => {
    if (socket) socket.emit('playerReady');
}


export enum GameStatus {
    InLobby, // when waiting for other player
    Starting, // game is starting in 3 seconds
    InProgress, // game in progress
    Win, // players found each other
    Loss, // players ran out of time
}

// game status data object definition
export interface GameStatusData {
    status: GameStatus
    timeRemaining: number // in seconds
    score: number // cumulative score after each game
}

// Subscribe to game status updates
export const subscribeToGameStatus = (cb: (data: GameStatusData) => void) => {
    if (!socket) return false;
    socket.on('gameStatus', cb);
    return true;
}

// on game start an initial position will be given
export const subscribeToInitialPosition = (cb: (data: GameUpdateData) => void) => {
    if (!socket) return false;
    socket.on('initialPosition', cb);
    return true;
}

