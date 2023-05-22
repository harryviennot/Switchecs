import io from "socket.io-client";
import { createContext, useState } from "react";
const socket = io("http://localhost:3001", { transports: ["websocket"] });
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [roomPin, setRoomPin] = useState("");

  return (
    <SocketContext.Provider
      value={{ socket, name, setName, roomPin, setRoomPin }}
    >
      {children}
    </SocketContext.Provider>
  );
};
