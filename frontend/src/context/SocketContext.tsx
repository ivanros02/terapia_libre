// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Obtener la URL base desde las variables de entorno de Vite
const url = import.meta.env.VITE_API_BASE_URL;

// Crear el contexto
const SocketContext = createContext<Socket | null>(null);

// Hook personalizado para usar el contexto
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket debe usarse dentro de un SocketProvider');
  }
  return socket;
};

// Proveedor del contexto
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Crear la conexión de Socket.io usando la configuración correcta
    const newSocket = io(url, {
      path: "/api_terapia/socket.io", // 🔹 Asegurar que el path coincide con el backend
      transports: ["websocket", "polling"], // 🔹 Habilitar ambos transportes
      withCredentials: true // 🔹 Permitir cookies y credenciales si es necesario
    });

    setSocket(newSocket);

    // Limpiar la conexión al desmontar el componente
    return () => {
      newSocket.disconnect();
    };
  }, [url]); // Dependencia: url

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
