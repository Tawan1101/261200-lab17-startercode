"use client";
import { useEffect, useState, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useAppSelector } from "@/stores/hook";
import { selectUser } from "@/stores/slices/userSlice";
import ChatMessageCard from "@/components/ChatMessage";
import { selectRoom } from "@/stores/slices/roomSlice";
import { MessageType } from "@/types/message_type";
import { useRouter } from "next/navigation";

const ChatRoom: React.FC = () => {
  const router = useRouter()
  const { sendMessage } = useWebSocket();
  const [newMessage, setNewMessage] = useState<string>("");
  const user = useAppSelector(selectUser);
  const room = useAppSelector(selectRoom);
  const messages = room?.messages || [];
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage) return;
    sendMessage("/chat/sendMessage", {
      sender: user?.username,
      message: newMessage,
      type: MessageType.CHAT,
    });
    setNewMessage("");
  };

  useEffect(() => {
    if (!user || !room) {
      router.push("/");
    }
  }, [user, room, router]);

  
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20"> 
        <div className="w-full max-w-5xl space-y-2 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-blue-200 to-teal-200 rounded-lg shadow-lg">
            <h2 className="text-4xl font-semibold text-gradient bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
              Chat Room
            </h2>
            <div className="text-xl font-medium text-gray-700">
              Current user: <span className="text-teal-500 font-semibold">{/*add number of user*/}</span>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="h-[calc(100vh-300px)] overflow-y-auto bg-gradient-to-br from-teal-50 to-indigo-50 rounded-lg p-4 border-2 border-gray-300 shadow-md"
          >
            <ul className="space-y-6">
              {messages.map((msg, index) => (
                <ChatMessageCard key={index} msg={msg} />
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-4 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-r from-indigo-100 to-indigo-50 text-gray-700 text-lg placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-gradient-to-l hover:from-pink-600 hover:to-yellow-600 transition-all"
            >
              <PaperAirplaneIcon className="h-6 w-6 text-white transform " />
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatRoom;