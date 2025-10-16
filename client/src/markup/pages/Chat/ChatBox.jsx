import React from "react";

function ChatBox() {
  return (
    <div className="flex w-full max-w-7xl h-[90vh] bg-white rounded-x overflow-hidden border border-gray-200">
      {/* Contact List */}
      <aside className="w-1/4 bg-gray-50 border-r border-gray-200 hidden lg:block">
        <div className="p-4 flex items-center border-b border-gray-200">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="w-12 h-12 rounded-full border-2 border-green-400"
          />
          <div className="ml-3">
            <p className="font-semibold text-gray-800">Samantha Michael</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto">
          {[
            {
              name: "Adrian Demian",
              img: 2,
              msg: "Looking forward to...",
            },
            { name: "Michelle Anister", img: 3, msg: "Nice design!" },
            {
              name: "James Carter",
              img: 4,
              msg: "Let’s catch up soon",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="flex items-center p-4 hover:bg-gray-100 cursor-pointer transition"
            >
              <img
                src={`https://i.pravatar.cc/40?img=${c.img}`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=2"
              className="w-10 h-10 rounded-full border-2 border-green-400"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-800">Adrian Demian</p>
              <p className="text-xs text-green-500">Typing...</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">Last seen: 2 min ago</span>
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
            className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="ml-3 bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-2 rounded-full flex items-center shadow-md">
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

export default ChatBox;
