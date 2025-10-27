import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../../socket";
import {
  fetchContacts,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessage,
} from "../../../services/chat.service";

import { useAuth } from "../../../Contexts/AuthContext";

export default function ChatBox() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showContactsMobile, setShowContactsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollableRef = useRef(null);
  const selectedContactRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  //  Audio for message send
  const sendSound = useRef(new Audio("/sounds/send.mp3"));

  // Input change handler
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Emit typing status
    if (selectedContact) {
      socket.emit("typing", {
        to: selectedContact.user_id,
        from: user.user_id,
        isTyping: e.target.value.length > 0,
      });
    }
  };
  useEffect(() => {
    selectedContactRef.current = selectedContact;

    const handleTypingEvent = (data) => {
      if (data.from !== selectedContactRef.current?.user_id) return;

      setIsTyping(data.isTyping);

      if (data.isTyping) {
        // Clear previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Stop typing after 1.5s of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    };

    socket.on("typing", handleTypingEvent);

    return () => {
      socket.off("typing", handleTypingEvent);
    };
  }, [selectedContact]);

  // Fetch contacts and initialize socket
  useEffect(() => {
    const init = async () => {
      const res = await fetchContacts();
      const currentUserId = user?.user_id;
      socket.auth = { userId: currentUserId };

      setContacts(
        res.data
          .filter((c) => c.user_id !== currentUserId)
          .map((c) => ({ ...c, unreadCount: 0 }))
      );

      socket.connect();
    };
    init();

    socket.on("online_users", (users) => setOnlineUsers(users));

    const handleReceiveMessage = (msg) => {
      // Only process messages sent to me
      if (msg.to !== user.user_id) return;

      if (
        selectedContactRef.current &&
        msg.from === selectedContactRef.current.user_id
      ) {
        // If current chat, show message
        setMessages((prev) => [
          ...prev,
          { ...msg, createdAt: new Date(msg.createdAt) },
        ]);
      } else {
        // Increment unread count only for this contact
        setContacts((prev) =>
          prev.map((c) =>
            c.user_id === msg.from
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c
          )
        );
      }
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [user?.user_id]);

  // Auto-scroll
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch unread count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        if (!user?.user_id) return;
        const res = await getUnreadMessage(user.user_id);
        setUnreadCount(res.data.totalUnread || 0);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    // Optional: refresh every 10 seconds
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user?.user_id]);

  const handleSend = async () => {
    if (!newMessage || !selectedContact) return;

    const msgObj = {
      from: user.user_id,
      to: selectedContact.user_id,
      message: newMessage,
      createdAt: new Date(),
    };
    // Play send sound
    sendSound.current.play().catch((err) => console.log(err));

    setMessages((prev) => [...prev, { ...msgObj, from: "me" }]);
    socket.emit("send_message", msgObj);
    await sendMessage(selectedContact.user_id, newMessage);
    setNewMessage("");
  };

  const selectContact = async (contact) => {
    setSelectedContact(contact);
    setContacts((prev) =>
      prev.map((c) =>
        c.user_id === contact.user_id ? { ...c, unreadCount: 0 } : c
      )
    );
    // mark all unread messages from this contact as read
    await markMessagesAsRead(contact.user_id);

    const res = await fetchMessages(contact.user_id);
    const msgs = (res.data || []).map((m) => ({
      ...m,
      createdAt: new Date(m.created_at || m.createdAt),
    }));
    setMessages(msgs);
  };

  console.log("Full user object:", `http://localhost:8080${user?.profile_img}`);
  return (
    <div className="flex w-full max-w-7xl h-[90vh] bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* Mobile toggle */}
      {/* Mobile hamburger */}
      <div className="lg:hidden flex p-2 border-b border-gray-200">
        <button
          onClick={() => setShowContactsMobile(!showContactsMobile)}
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showContactsMobile ? (
            // X / Close icon
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Contact List */}
      <aside
        className={`w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto ${
          showContactsMobile ? "block absolute z-50 h-full" : "hidden lg:block"
        }`}
      >
        <div>
          {contacts.map((c) => {
            const isSelected = selectedContact?.user_id === c.user_id;
            return (
              <div
                key={c.user_id}
                onClick={() => selectContact(c)}
                className={`flex items-center p-3 cursor-pointer border-l-4 ${
                  isSelected
                    ? "bg-blue-50 border-blue-500"
                    : "border-transparent hover:bg-gray-100"
                }`}
              >
                <img
                  src={
                    c.profile_img?`http://localhost:8080${c.profile_img}`:
                    "https://i.pravatar.cc/40?img=11"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isSelected ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {c.user_full_name}
                  </p>
                  <div className="flex items-center text-xs mt-1">
                    {onlineUsers.includes(c.user_id) && (
                      <span className="text-green-500 mr-2">Online</span>
                    )}
                    {c.unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full px-2">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        {selectedContact && (
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <img
                src={ 
                   selectedContact?.profile_img?`http://localhost:8080${selectedContact?.profile_img }`:
                    "https://i.pravatar.cc/40?img=11"
                }
                className="w-10 h-10 rounded-full border-2 border-green-400"
                alt="profile"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">
                  {selectedContact?.user_full_name || ""}
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
                    : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollableRef}
          className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50"
          style={{ paddingBottom: "80px" }}
        >
          {messages.map((msg, index) => {
            const isSent = msg.from === user?.user_id || msg.from === "me";

            return (
              <div
                key={index}
                className={`flex items-end ${
                  isSent ? "justify-end" : "justify-start"
                } space-x-2`}
              >
                {/* Incoming avatar */}
                {!isSent && (
                  <img
                    src={
                      selectedContact?.profile_img
                        ? `http://localhost:8080${selectedContact?.profile_img}`
                        : "https://i.pravatar.cc/40?img=11"
                    }
                    className="w-8 h-8 rounded-sm"
                    alt="profile"
                  />
                )}

                {/* Chat bubble */}
                <div
                  className={`
            relative p-3 max-w-xs break-words
            ${isSent ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"}
            rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none
            hover:brightness-110 transition-all duration-150 shadow-md
          `}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Outgoing avatar */}
                {isSent && (
                  <img
                    src={
                      user?.profile_img
                        ? `http://localhost:8080${user?.profile_img}`
                        : "https://i.pravatar.cc/40?img=11"
                    }
                    className="w-8 h-8 rounded-sm"
                    alt="profile"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        {selectedContact && (
          <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleInputChange} // use new handler
              className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {newMessage.trim() !== "" && (
              <button
                onClick={handleSend}
                className="ml-3 cursor-pointer bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-2 rounded-full flex items-center shadow-md"
              >
                Send
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
