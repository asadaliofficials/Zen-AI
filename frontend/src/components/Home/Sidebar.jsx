import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../conformPopup";
import { toast } from "react-toastify";
import { setChatId, setTempChat } from "../../features/chats/chatSlice";
import { clearMessages } from "../../features/messages/messagesSlice";
import axiosInstance from "../../services/axios.service";
// import '../../css/chat.css';
const Sidebar = ({ isOpen, onToggle , theme }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const chats = useSelector((state) => state.chats.chats);
  const dispatch = useDispatch();

  const isTemp = useSelector((state) => state.chats.isTemp);

  const chatId = useSelector((state) => state.chats.chatId);
  const Navigate = useNavigate();
  const handleNewChat = () => {
    dispatch(setChatId(null));
    dispatch(clearMessages());
    dispatch(setTempChat(false));
    Navigate("/");
    document.title = "Zen Ai";
  };

  const user = useSelector((state) => state.user.user);

  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    closed: { x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
  };
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDelAccPopup, setshowDelAccPopup] = useState(false);
  const navigate = useNavigate();
  const logoutHandler = () => {
    setTimeout(() => {
      Cookies.remove("token");
      navigate("/auth");
    }, 2000);
  };
  const accountDeleteHandler = async () => {
    try {
      const response = await axiosInstance.delete(
        `/auth/delete/${user.userId}`
      );
      if (!response.data.success) throw new Error("failed to delete account!");
      toast.success("Account deleted successfully!");
      setTimeout(() => {
        Cookies.remove("token");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("failed to delete account!");
    }
  };

  const handleChatClick = (id) => {
    dispatch(setTempChat(false));
    dispatch(setChatId(id));
  };

  const handleTempChat = () => {
    dispatch(setChatId(null));
    dispatch(clearMessages());
    dispatch(setTempChat(true));
    Navigate("/?temporary=true");
    document.title = "Zen - Sandbox";
  };

  // check on first load if alraedy temp chat then dispatch
  useEffect(() => {
    const isTempUrl = window.location.search.includes("temporary=true");
    if (isTempUrl) {
      dispatch(setChatId(null));
      dispatch(clearMessages());
      dispatch(setTempChat(true));
      document.title = "Zen - Sandbox";
    }
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  backdrop-blur-xs bg-opacity-20 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:relative top-0 left-0 h-full w-72 z-50 bg-[#F9F9F9] dark:bg-[#181818] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img src="/images/logo.png" alt="logo" className="w-8 h-9" />
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">
              Zen-AI
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-[#303030] lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <g fill="none" fillRule="evenodd">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                <path
                  fill={theme}
                  d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2 0h3v14H5zm11.207 5.586L14.793 12l1.414 1.414a1 1 0 0 1-1.414 1.414l-2.121-2.12a1 1 0 0 1 0-1.415l2.121-2.121a1 1 0 1 1 1.414 1.414"
                ></path>
              </g>
            </svg>
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full cursor-pointer flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white"
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Chat</span>
          </button>
          <button
            onClick={handleTempChat}
            className={`w-full cursor-pointer flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white ${
              isTemp == true ? "bg-gray-300 dark:bg-[#303030]" : ""
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.06 13c-1.86 0-3.42 1.33-3.82 3.1c-.95-.41-1.82-.3-2.48-.01C10.35 14.31 8.79 13 6.94 13C4.77 13 3 14.79 3 17s1.77 4 3.94 4c2.06 0 3.74-1.62 3.9-3.68c.34-.24 1.23-.69 2.32.02c.18 2.05 1.84 3.66 3.9 3.66c2.17 0 3.94-1.79 3.94-4s-1.77-4-3.94-4M6.94 19.86c-1.56 0-2.81-1.28-2.81-2.86s1.26-2.86 2.81-2.86c1.56 0 2.81 1.28 2.81 2.86s-1.25 2.86-2.81 2.86m10.12 0c-1.56 0-2.81-1.28-2.81-2.86s1.25-2.86 2.81-2.86s2.82 1.28 2.82 2.86s-1.27 2.86-2.82 2.86M22 10.5H2V12h20zm-6.47-7.87c-.22-.49-.78-.75-1.31-.58L12 2.79l-2.23-.74l-.05-.01c-.53-.15-1.09.13-1.29.64L6 9h12l-2.44-6.32z" />
            </svg>
            <span>Temporary Chat</span>
          </button>
          <button
            onClick={() => {
              toast.error("Feature not implemented yet!");
            }}
            className="w-full cursor-pointer flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white"
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
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span>Special Personalities</span>
          </button>

          <button
            onClick={() => {
              toast.error("Feature not implemented yet!");
            }}
            className="w-full cursor-pointer flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white"
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
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Generate Content</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4 overflow-y-auto dark:scrollbar-thin dark:scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">
            Chats:
          </h3>
          <div className="space-y-1">
            {!chats || chats.length === 0 ? (
              <p className="text-black dark:text-white opacity-30">
                No Chat History
              </p>
            ) : (
              chats
                .slice()
                .reverse()
                .map((chat, idx) => (
                  <button
                    title={chat.title}
                    key={idx}
                    id={chat._id || chat.id}
                    onClick={() => handleChatClick(chat._id || chat.id)}
                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-gray-700 dark:text-gray-300 truncate ${
                      chatId === (chat._id || chat.id)
                        ? "bg-gray-300 dark:bg-[#303030]"
                        : ""
                    }`}
                  >
                    {chat.title}
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t  border-gray-200 dark:border-zinc-700">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.userName[0]}
                </span>
              </div>
              <div className="flex-1 text-left w-[70%] truncate">
                <div className="text-sm font-medium">{user.userName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.userEmail}
                </div>
              </div>
              <svg
                className="w-5 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M12 5v.01M12 12v.01M12 19v.01"
                />
              </svg>
            </button>

            {/* Profile Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute  bottom-full left-0 right-0 mb-2 py-1 rounded-lg shadow-lg border dark:bg-[#181818] dark:border-gray-700 bg-white border-gray-200`}
                >
                  <button
                    onClick={() => {
                      setShowLogoutPopup((state) => !state);
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className="w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-black dark:text-white"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      setshowDelAccPopup((state) => !state);
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className="w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors hover:bg-gray-300 dark:hover:bg-[#303030] text-red-600 dark:text-red-400"
                  >
                    Delete Account
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      {showLogoutPopup ? (
        <ConfirmPopup
          show={showLogoutPopup}
          title="Logout"
          description="Are you sure you want to log out?"
          confirmLabel="Logout"
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={logoutHandler}
        />
      ) : (
        ""
      )}
      {showDelAccPopup ? (
        <ConfirmPopup
          show={showDelAccPopup}
          title="Delete Account"
          description="Are you sure you want to delete you Account?"
          confirmLabel="Delete"
          onCancel={() => setshowDelAccPopup(false)}
          onConfirm={accountDeleteHandler}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Sidebar;
