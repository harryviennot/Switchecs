import io from "socket.io-client";
import { createContext, useState } from "react";
const socket = io("http://localhost:3000", { transports: ["websocket"] });
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [roomPin, setRoomPin] = useState("");

  // console.log("socket", socket.id);

  return (
    <SocketContext.Provider
      value={{ socket, name, setName, roomPin, setRoomPin }}
    >
      {children}
    </SocketContext.Provider>
  );
};
