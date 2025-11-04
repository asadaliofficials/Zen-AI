import React, { useState } from "react";
import { toast } from "react-toastify";
import SharePopup from "../SharePopup";
import { useSelector } from "react-redux";

const ResponseActions = ({
  message,
  handlers,
  isSandbox,
  handleScreenshot,
  isReading,
}) => {
  // Local state for each message's actions
  const [isCopied, setIsCopied] = useState(false);
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
  const readingMessageId = useSelector((state) => state.ui.readingMessageId);
  const isTemp = useSelector((state) => state.chats.isTemp);

  const handleCopy = () => {
    handlers.copyMessage(message.content, message.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScreenshotClick = async () => {
    setIsScreenshotTaken(true);
    // Wait a bit for the icon to change before taking screenshot
    await new Promise((resolve) => setTimeout(resolve, 100));
    handleScreenshot(message.id);
    setTimeout(() => setIsScreenshotTaken(false), 2000);
  };

  const handleReadAloud = () => {
    handlers.readAloud(message.content, message.id);
  };
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShareClick = () => {
    if (!message.id) return;
    if (isTemp) {
      toast.error("Cannot share temporary chat!");
      return;
    }
    setShowSharePopup(true);
  };

  const handleShareClose = () => {
    setShowSharePopup(false);
  };

  return (
    <div className="flex items-center space-x-2 mt-2 ml-2">
      {/* copy button */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 text-black dark:hover:bg-[#303030] dark:text-white"
        title="Copy"
      >
        {isCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 15 15"
          >
            <path
              strokeWidth={2}
              fill="currentColor"
              d="M10 4V2.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H4V5.5A1.5 1.5 0 0 1 5.5 4zM5.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zm7-1A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 12.5V11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V4z"
            />
          </svg>
        )}
      </button>
      {/* screenshot button */}
      <button
        onClick={handleScreenshotClick}
        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 text-black dark:hover:bg-[#303030] dark:text-white"
        title="Screenshot"
      >
        {isScreenshotTaken ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6.25 3A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3zM4.5 6.25c0-.966.784-1.75 1.75-1.75h11.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75zM8 7.5a.5.5 0 0 0-.5.5v2.25a.75.75 0 0 1-1.5 0V8a2 2 0 0 1 2-2h2.25a.75.75 0 0 1 0 1.5zm0 9a.5.5 0 0 1-.5-.5v-2.25a.75.75 0 0 0-1.5 0V16a2 2 0 0 0 2 2h2.25a.75.75 0 0 0 0-1.5zM16.5 8a.5.5 0 0 0-.5-.5h-2.25a.75.75 0 0 1 0-1.5H16a2 2 0 0 1 2 2v2.25a.75.75 0 0 1-1.5 0zm-.5 8.5a.5.5 0 0 0 .5-.5v-2.25a.75.75 0 0 1 1.5 0V16a2 2 0 0 1-2 2h-2.25a.75.75 0 0 1 0-1.5z"
            />
          </svg>
        )}
      </button>

      <button
        onClick={() => {
          if (isSandbox)
            return toast.error("Please login to use this Feature!");
          if (isReading) return toast.error("This is readonly Chat!");
          handlers.loveMessage(message.id);
        }}
        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 text-black dark:hover:bg-[#303030] dark:text-white"
        title="Love"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 48 48"
        >
          <path
            fill={message.loved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
          ></path>
        </svg>
      </button>

      <button
        onClick={() => {
          if (isSandbox)
            return toast.error("Please login to use this Feature!");
          if (isReading) return toast.error("This is readonly Chat!");
          handleShareClick();
        }}
        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 text-black dark:hover:bg-[#303030] dark:text-white"
        title="Share"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 5v8.5M15 7l-3-3l-3 3m-4 5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
          />
        </svg>
      </button>
      <button
        onClick={handleReadAloud}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          readingMessageId === message.id
            ? "bg-gray-200 text-black dark:bg-[#303030] dark:text-white"
            : "hover:bg-gray-200 text-black dark:hover:bg-[#303030] dark:text-white"
        }`}
        title="Read Aloud"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2 14.959V9.04C2 8.466 2.448 8 3 8h3.586a.98.98 0 0 0 .707-.305l3-3.388c.63-.656 1.707-.191 1.707.736v13.914c0 .934-1.09 1.395-1.716.726l-2.99-3.369A.98.98 0 0 0 6.578 16H3c-.552 0-1-.466-1-1.041M16 8.5c1.333 1.778 1.333 5.222 0 7M19 5c3.988 3.808 4.012 10.217 0 14"
          />
        </svg>
      </button>
      <SharePopup
        show={showSharePopup}
        id={message.id}
        onClose={handleShareClose}
        sharing={"message"}
      />
    </div>
  );
};

export default ResponseActions;
