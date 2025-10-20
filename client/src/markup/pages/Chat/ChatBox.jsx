import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../../socket";
import {
  fetchContacts,
  fetchMessages,
  sendMessage,
} from "../../../services/chat.service";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChatBox() {
  const { user, isLogged, isAdmin, isInstructor, isStudent } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    fetchContacts().then((res) => {
      const currentUserId =user?.user_id;
      // const currentUserId = res.data.map((contact) => contact.user_id);
      socket.auth = { userId: currentUserId };

      setContacts(res.data);
    });
    socket.connect();
    socket.on("online_users", (users) => {
      setOnlineUsers(users); // users = array of user IDs
    });

    socket.on("receive_message", (msg) => {
      if (msg.from === selectedContact?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [selectedContact]);
  //  Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage || !selectedContact) return;
    
    await sendMessage(selectedContact.user_id, newMessage);
    socket.emit("send_message", {
      from: user?.user_id, 
      to: selectedContact.user_id,
      message: newMessage,
      createdAt: new Date(),
    });
    setMessages((prev) => [
      ...prev,
      { from: "me", message: newMessage, createdAt: new Date() },
    ]);
    setNewMessage("");
  };

  const selectContact = async (contact) => {
    setSelectedContactId(contact.user_id);
    setSelectedContact(contact);
    const res = await fetchMessages(contact.user_id);
    setMessages(res.data || []);
  };

  // Check if tryping
  const [isTyping, setIsTyping] = useState(false);
  socket.on("typing", (data) => {
    if (data.from === selectedContact?.user_id) {
      setIsTyping(data.isTyping); // true or false
    }
  });
  return (
    <div className="flex w-full max-w-7xl h-[90vh] bg-white rounded-x overflow-hidden border border-gray-200">
      {/* Contact List */}
      <aside className="w-1/4 bg-gray-50 border-r border-gray-200 hidden lg:block">
        <div className="p-4 flex items-center border-b border-gray-200">
          <div>
            {contacts
              .filter((c) => c.user_id !== user?.user_id)
              .map((c) => {
                const contactId = c.user_id; // 👈 use the correct property
                const isSelected = selectedContactId === contactId;

                return (
                  <div
                    key={contactId}
                    onClick={() => selectContact(c)}
                    className={`flex w-57 items-center p-3 rounded-lg cursor-pointer transition border-l-4 ${
                      isSelected
                        ? "bg-blue-50 border-blue-500"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src="https://i.pravatar.cc/40?img=11"
                      alt="profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isSelected ? "text-blue-700" : "text-gray-800"
                        }`}
                      >
                        {c.user_full_name}
                      </p>
                      {/* <p className="text-xs text-green-500">Online</p> */}
                      {onlineUsers.includes(c.user_id) && (
                        <p className="text-xs text-green-500">Online</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={
                selectedContact?.profile_img
                  ? selectedContact.profile_img
                  : "https://i.pravatar.cc/40?img=2"
              }
              className="w-10 h-10 rounded-full border-2 border-green-400"
              alt="profile"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-800">
                {selectedContact?.user_full_name ||
                  selectedContact?.user_email ||
                  "Select a contact"}
              </p>
              <p className="text-xs text-green-500">
                {isTyping
                  ? "Typing..."
                  : onlineUsers.includes(selectedContact?.user_id)
                  ? "Online"
                  : selectedContact?.last_seen
                  ? `Last seen: ${new Date(
                      selectedContact.last_seen
                    ).toLocaleTimeString()}`
                  : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {/* Received Message */}
          <div className="flex items-start space-x-3">
            <img
              src="https://i.pravatar.cc/40?img=2"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl max-w-xs shadow-sm">
              <p>Hey Samantha 👋</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">15:21</p>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex items-start justify-end space-x-3">
            <div className="bg-blue-500 text-white p-3 rounded-2xl max-w-xs shadow-sm">
              <p>Hi Adrian! Sure, tomorrow works great 😊</p>
              <p className="text-[10px] text-blue-100 mt-1 text-right">15:22</p>
            </div>
            <img
              src="https://i.pravatar.cc/40?img=1"
              className="w-8 h-8 rounded-full"
            />
          </div>

          {/* Another Received */}
          <div className="flex items-start space-x-3">
            <img
              src="https://i.pravatar.cc/40?img=2"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl max-w-xs shadow-sm">
              <p>Perfect! See you at 4PM then 👌</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">15:24</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleSend} className="ml-3 bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-2 rounded-full flex items-center shadow-md">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A1 1 0 0017.663 5H2.337a1 1 0 00-.334.884z" />
              <path d="M18 8.118l-8 4-8-4V14a1 1 0 001 1h14a1 1 0 001-1V8.118z" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
