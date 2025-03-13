import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap'; // Importar componentes de Bootstrap

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<number | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false); // Estado para el modal de nuevo chat
  const [newChatUserId, setNewChatUserId] = useState(''); // Estado para el ID del usuario del nuevo chat
  const socket = useSocket();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener el ID del usuario/profesional y el token del localStorage
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const esProfesional = localStorage.getItem('esProfesional') === 'true';



  // Verificar autenticación
  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
    }
  }, [navigate, token, userId]);

  // Obtener el chatId al cargar el componente
  useEffect(() => {
    const fetchChatId = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/chatId`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId,
            esProfesional,
          },
        });
        setChatId(response.data.chatId);
      } catch (error) {
        console.error("Error al obtener el chatId:", error);
        setChatId(null); // 🔹 Evita que el frontend crashee
      }
    };

    fetchChatId();
  }, [token, userId, esProfesional]);

  // Mostrar mensaje si no hay chat
  {
    chatId === null ? (
      <div className="alert alert-warning text-center">
        No tienes chats disponibles. Inicia una conversación con un profesional.
      </div>
    ) : (
      <div> {/* Renderizar mensajes aquí */} </div>
    )
  }

  useEffect(() => {
    if (socket && chatId !== null) {
      socket.emit("join_chat", chatId);
      console.log(`📡 Uniendo al chat: ${chatId}`);

      const handleReceiveMessage = (newMessage: SocketMessage) => {
        if (newMessage.senderId === parseInt(userId || '0')) {
          // Ignora tu propio mensaje, ya fue añadido localmente.
          return;
        }

        setMessages((prevMessages) => {
          const exists = prevMessages.some(msg => msg.id_mensaje === newMessage.id_mensaje);
          if (exists) return prevMessages;

          return [
            ...prevMessages,
            {
              id_mensaje: newMessage.id_mensaje,
              id_chat: newMessage.id_chat,
              id_remitente: newMessage.senderId,
              mensaje: newMessage.message,
            },
          ];
        });
      };


      // Limpiar el listener anterior antes de agregar uno nuevo
      socket.off("receive_message", handleReceiveMessage); // Limpiar listener previo
      socket.on("receive_message", handleReceiveMessage); // Agregar nuevo listener

      // Cargar mensajes anteriores solo una vez al entrar al chat
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/chat/${chatId}/messages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Error al obtener los mensajes:', error);
        }
      };

      fetchMessages();

      // Limpiar el listener cuando el componente se desmonte
      return () => {
        socket.off("receive_message", handleReceiveMessage);
      };
    }
  }, [socket, chatId, token]);




  // Enviar un mensaje
  const sendMessage = async () => {
    if (!socket || !newMessage.trim() || chatId === null || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id_mensaje: tempId,
      id_chat: chatId,
      id_remitente: parseInt(userId || '0'),
      mensaje: newMessage,
    };

    // Agregar mensaje temporal a la lista
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // Enviar mensaje al backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/message`,
        {
          id_chat: chatId,
          id_remitente: parseInt(userId),
          mensaje: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Crear mensaje con el ID real
      const savedMessage: Message = {
        id_mensaje: response.data.messageId,
        id_chat: chatId,
        id_remitente: parseInt(userId),
        mensaje: newMessage
      };

      // Reemplazar el mensaje temporal con el mensaje guardado
      setMessages((prev) =>
        prev.map((msg) => (msg.id_mensaje === tempId ? savedMessage : msg))
      );

      // 🔹 Evitar recibir el mensaje duplicado por el socket
      socket.emit('send_message', {
        chatId,
        senderId: parseInt(userId || '0'),
        message: newMessage,
        id_mensaje: response.data.messageId, // Agregar el ID real del mensaje
      });

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      // Eliminar mensaje temporal en caso de error
      setMessages((prev) => prev.filter((msg) => msg.id_mensaje !== tempId));
    }

    setNewMessage('');
  };




  // Desplazarse al final de los mensajes cuando se agrega uno nuevo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Crear un nuevo chat
  const createNewChat = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/chat`,
        {
          id_profesional: esProfesional ? userId : newChatUserId,
          id_usuario: esProfesional ? newChatUserId : userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatId(response.data.chatId);
      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error al crear el chat:', error);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Navbar con botón para crear nuevo chat */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Chat</span>
          <Button variant="primary" onClick={() => setShowNewChatModal(true)}>
            Nuevo Chat
          </Button>
        </div>
      </nav>

      {/* Lista de mensajes */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg, index) => (
          <div key={msg.id_mensaje ?? `temp-${index}`} className={`d-flex my-2 ${msg.id_remitente === parseInt(userId || '0') ? 'justify-content-end' : 'justify-content-start'}`}>
            <div
              className={`p-3 rounded ${msg.id_remitente === parseInt(userId || '0')
                ? 'bg-primary text-white'
                : 'bg-light text-dark'
                }`}
              style={{ maxWidth: '75%' }}
            >
              <p className="mb-0">{msg.mensaje}</p>
              <small className="d-block text-end opacity-75">
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para enviar mensajes */}
      <div className="p-3 bg-white border-top">
        <div className="input-group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="form-control"
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Modal para crear un nuevo chat */}
      <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>ID del Usuario</Form.Label>
              <Form.Control
                type="text"
                value={newChatUserId}
                onChange={(e) => setNewChatUserId(e.target.value)}
                placeholder="Ingresa el ID del usuario"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewChatModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={createNewChat}>
            Crear Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Messages;