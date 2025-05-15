import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const url = import.meta.env.VITE_API_BASE_URL;
const ENABLE_SOCKET = import.meta.env.VITE_ENABLE_SOCKET === "true"; // ⚙️ Nueva variable

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket debe usarse dentro de un SocketProvider');
  }
  return socket;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!ENABLE_SOCKET) return; // 🛑 No conectar si está deshabilitado

    const newSocket = io(url, {
      path: "/api_terapia/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
