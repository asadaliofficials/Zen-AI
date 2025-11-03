import { useEffect, useState } from "react";
import ChatSandbox from "./Chat.sandbox";

const HomeSandbox = () => {
  const [isReadingChat, setIsReadingChat] = useState(false);
  const [isReadingMessage, setIsReadingMessage] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const readingChat = path.includes("/c/read/");
    const readingMessage = path.includes("/m/read/");
    setIsReadingChat(readingChat);
    setIsReadingMessage(readingMessage);
  }, []);

  return (
    <div className="flex h-screen dark:bg-gray-900 bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <ChatSandbox
          isReadingChat={isReadingChat}
          isReadingMessage={isReadingMessage}
        />
      </div>
    </div>
  );
};

export default HomeSandbox;
