import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../conformPopup";
import SharePopup from "../SharePopup";
import { deleteOneChat, setChatId } from "../../features/chats/chatSlice";
import { clearChat } from "../../features/messages/messagesSlice";

const TopBar = ({ models = [], selectedModel, setSelectedModel }) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const chatId = useSelector((state) => state.chats.chatId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(chatId);

  const handleDeleteClick = () => {
    if (!chatId) {
      toast.error("Please select a chat to delete!");
      return;
    }
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/chat/delete/${chatId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Chat deleted successfully!");
        document.title = "Zen AI";
        dispatch(deleteOneChat(response.data.id));
        console.log(response.data.id);
        dispatch(clearChat());
        dispatch(setChatId(null));
        navigate("/");
        setShowDeletePopup(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };

  const handleShareClick = () => {
    if (!chatId) {
      toast.error("Please select a chat to share!");
      return;
    }
    setShowSharePopup(true);
  };

  const handleShareClose = () => {
    setShowSharePopup(false);
  };

  return (
    <div className="flex bg-transparent items-center justify-between p-4">
      {/* Model Selection */}
      <div className="relative model-dropdown">
        <button
          onClick={() => setShowModelDropdown(!showModelDropdown)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors dark:bg-[#2a2a2a] dark:border-gray-600 dark:hover:bg-[#353535] dark:text-white bg-gray-50 border-gray-300 hover:bg-gray-100 text-black`}
        >
          <span className="text-sm font-medium">
            {models.find((m) => m.id === selectedModel)?.name ?? selectedModel}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showModelDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <AnimatePresence>
          {showModelDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 mt-2 w-48 py-1 rounded-lg shadow-lg z-50 dark:bg-[#2a2a2a] dark:border-gray-600 bg-white border-gray-300`}
            >
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors ${
                    selectedModel === model.id
                      ? "dark:bg-[#404040] dark:text-white bg-blue-50 text-blue-600"
                      : "dark:hover:bg-[#353535] dark:text-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{model.name}</span>
                    {selectedModel === model.id && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {chatId ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDeleteClick}
            className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:text-red-400 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700`}
            title="Delete Chat"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          <button
            onClick={handleShareClick}
            className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:text-white dark:hover:text-gray-100 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900`}
            title="Share Chat"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v8.5M15 7l-3-3l-3 3m-4 5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
              />
            </svg>
          </button>
        </div>
      ) : (
        ""
      )}

      {/* Delete Confirmation Popup */}
      <ConfirmPopup
        show={showDeletePopup}
        title="Delete Chat"
        description="Are you sure you want to delete this chat? This action cannot be undone."
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        isProcessing={isDeleting}
      />

      {/* Share Popup */}
      <SharePopup
        show={showSharePopup}
        id={chatId}
        onClose={handleShareClose}
        sharing={"chat"}
      />
    </div>
  );
};

export default TopBar;
