import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, ListGroup } from "react-bootstrap"; // Importar componentes de Bootstrap

interface Chat {
  id_chat: number;
  id_profesional: number;
  id_usuario: number;
  nombre?: string; // 🔹 Agregamos 'nombre' para los usuarios disponibles en el modal
  nombre_usuario?: string; // 🔹 Agregamos estos para los nombres en la lista de chats
  nombre_profesional?: string;
}



interface Message {
  id_mensaje: string | number;
  id_chat: number;
  id_remitente: number;
  mensaje: string;
}

interface SocketMessage {
  id_mensaje: string | number;
  id_chat: number;
  senderId: number;
  message: string;
}

const Messages: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Chat[]>([]); // Usuarios disponibles para nuevo chat
  const socket = useSocket();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const esProfesional = localStorage.getItem("esProfesional") === "true";

  // 🔹 Redirigir si no está autenticado
  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    }
  }, [navigate, token, userId]);

  // 🔹 Obtener lista de chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId, esProfesional },
          }
        );
        setChats(response.data);
      } catch (error) {
        console.error("Error al obtener los chats:", error);
      }
    };

    fetchChats();
  }, [token, userId, esProfesional]);

  // 🔹 Obtener mensajes cuando se selecciona un chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${selectedChat.id_chat}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
      }
    };

    fetchMessages();

    if (socket) {
      socket.emit("join_chat", selectedChat.id_chat);

      const handleReceiveMessage = (newMessage: SocketMessage) => {
        if (!selectedChat || newMessage.id_chat !== selectedChat.id_chat) return;

        setMessages((prevMessages) => {
          // 🔹 Evitar agregar mensajes enviados por el propio usuario
          if (newMessage.senderId === parseInt(userId || "0")) return prevMessages;

          // 🔹 Filtrar para asegurarnos de que no se dupliquen mensajes
          const exists = prevMessages.find(msg => msg.id_mensaje === newMessage.id_mensaje);
          if (exists) return prevMessages;

          return [...prevMessages, {
            id_mensaje: newMessage.id_mensaje,
            id_chat: newMessage.id_chat,
            id_remitente: newMessage.senderId,
            mensaje: newMessage.message,
          }];
        });
      };

      socket.on("receive_message", handleReceiveMessage);

      return () => {
        socket.off("receive_message", handleReceiveMessage);
      };
    }
  }, [socket, selectedChat, token]);

  // 🔹 Enviar un mensaje
  const sendMessage = async () => {
    if (!socket || !newMessage.trim() || !selectedChat || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id_mensaje: tempId,
      id_chat: selectedChat.id_chat,
      id_remitente: parseInt(userId || "0"),
      mensaje: newMessage,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/message`,
        {
          id_chat: selectedChat.id_chat,
          id_remitente: parseInt(userId),
          mensaje: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) =>
        prev.map((msg) => (msg.id_mensaje === tempId ? { ...msg, id_mensaje: response.data.messageId } : msg))
      );

      socket.emit("send_message", {
        chatId: selectedChat.id_chat,
        senderId: parseInt(userId || "0"),
        message: newMessage,
        id_mensaje: response.data.messageId,
      });

    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setMessages((prev) => prev.filter((msg) => msg.id_mensaje !== tempId));
    }

    setNewMessage("");
  };

  // 🔹 Obtener lista de usuarios disponibles para chat
  useEffect(() => {
    if (!showNewChatModal) return;

    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/available-users`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId, esProfesional },
          }
        );
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios disponibles:", error);
      }
    };

    fetchAvailableUsers();
  }, [showNewChatModal, token, userId, esProfesional]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId, esProfesional },
        }
      );

      if (Array.isArray(response.data)) {
        setChats(response.data);
      } else {
        console.error("⚠️ La API no devolvió un array:", response.data);
        setChats([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener los chats:", error);
    }
  };

  // 🔹 Crear nuevo chat
  const createNewChat = async (id_usuario_o_profesional: number) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chat`,
        {
          id_profesional: esProfesional ? userId : id_usuario_o_profesional,
          id_usuario: esProfesional ? id_usuario_o_profesional : userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nuevoChat = response.data;

      // 🔹 Ocultar el modal antes de actualizar el estado
      setShowNewChatModal(false);

      // 🔹 Esperar a que `fetchChats()` obtenga los datos correctos antes de actualizar `setSelectedChat`
      fetchChats().then(() => {
        setTimeout(() => {
          setChats((prevChats) => {
            const updatedChats = prevChats.find(chat => chat.id_chat === nuevoChat.id_chat);
            if (updatedChats) {
              setSelectedChat(updatedChats); // 🔹 Selecciona el chat con datos correctos
            }
            return prevChats; // Mantiene los chats sin agregar duplicados
          });
        }, 300); // 🔹 Agregamos un pequeño retraso para evitar problemas de sincronización
      });

    } catch (error) {
      console.error("Error al crear el chat:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);




  return (
    <div className="d-flex flex-column flex-md-row bg-light justify-content-center align-items-center">
      {/* Contenedor principal */}
      <div className="container-fluid h-100 d-flex flex-column flex-md-row align-items-center justify-content-center">

        {/* 📌 Lista de chats (en móviles ocupa todo el ancho) */}
        <div className="col-12 col-md-3 border-end p-3 bg-white shadow-sm d-flex flex-column align-items-center">
          <h5 className="text-center text-md-start">Chats</h5>
          <ListGroup>
            {chats.map((chat) => (
              <ListGroup.Item
                key={`chat-${chat.id_chat}`} // 🔹 Se asegura un key único agregando un prefijo
                action
                onClick={() => setSelectedChat(chat)}
              >
                {esProfesional
                  ? chat.nombre_usuario || "Usuario desconocido"
                  : chat.nombre_profesional || "Profesional desconocido"}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button variant="primary" className="mt-3" onClick={() => setShowNewChatModal(true)}>
            Nuevo Chat
          </Button>
        </div>

        {/* Modal para crear un nuevo chat */}
        <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar usuario para chatear</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Verificar si hay datos en availableUsers */}
            {availableUsers.length > 0 ? (
              <ListGroup>
                {availableUsers.map((user) => (
                  <ListGroup.Item
                    key={`user-${user.id_usuario || user.id_profesional}`} // 🔹 Se asegura un key único
                    action
                    onClick={() => createNewChat(esProfesional ? user.id_usuario : user.id_profesional)}
                  >
                    {user.nombre || "Usuario Desconocido"}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-center text-muted">No hay usuarios disponibles para chatear.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewChatModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>


      </div>

      {/* Chat seleccionado */}
      <div className="col-12 col-md-9 d-flex flex-column align-items-center justify-content-center">

        {selectedChat ? (
          <>
           <div className="chat-container bg-white border rounded shadow-sm p-3 d-flex flex-column w-100" style={{ maxWidth: "900px", height: "80vh" }}>


              {/* 🔹 Header del chat (siempre visible) */}
              <div className="chat-header bg-primary text-white p-3 rounded-top">
                <h5 className="mb-0">
                  Chat con {esProfesional
                    ? selectedChat?.nombre_usuario || "Usuario desconocido"
                    : selectedChat?.nombre_profesional || "Profesional desconocido"}
                </h5>
              </div>


              {/* 🔹 Caja de mensajes con scroll interno */}
              <div className="messages-box flex-grow-1 overflow-auto p-3" style={{ maxHeight: "calc(100% - 110px)" }}>
                {messages.map((msg) => {
                  const isSentByUser = msg.id_remitente === parseInt(userId || "0");
                  return (
                    <div key={msg.id_mensaje} className={`d-flex my-2 ${isSentByUser ? "justify-content-end" : "justify-content-start"}`}>
                      <div
                        className={`p-2 rounded shadow-sm ${isSentByUser ? "bg-primary text-white" : "bg-light text-dark"}`}
                        style={{
                          maxWidth: "75%",
                          borderRadius: "15px",
                          padding: "10px 15px",
                          wordBreak: "break-word",
                        }}
                      >
                        <p className="mb-0">{msg.mensaje}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input para escribir mensajes */}
              <div className="p-3 border-top d-flex align-items-center bg-light">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button variant="primary" onClick={sendMessage}>Enviar</Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-5">Selecciona un chat para empezar a chatear.</p>
        )}
      </div>

    </div>
  );
};

export default Messages;
