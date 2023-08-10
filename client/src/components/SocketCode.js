import { io } from "socket.io-client";
export const socket = io('ws://localhost:5000');
// fot local