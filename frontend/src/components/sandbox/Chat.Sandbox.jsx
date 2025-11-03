import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../../css/chat.css";
import MessagesList from "../home/MessagesList";
import Input from "../home/Input";
import screenShotAudio from "../../assets/sound/screenshot.mp3";

import {
  addMessage,
  clearChat,
  clearMessages,
  setMessages,
} from "../../features/messages/messagesSlice";
import {
  setTyping,
  setWaiting,
  setCancelRequestId,
  setCopyState,
  setScreenshotState,
  setReadingMessage,
  setSelectedModel,
} from "../../features/ui/uiSlice";
import TopBarSandbox from "./TopBar.sandbox";
import { sandboxSocket } from "../../sockets/client.socket";
import { toast } from "react-toastify";
import mdToPlainText from "../../utils/mdToText.util";
import { scrollToFullBottom, smartScroll } from "../../utils/autoScroll.util";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios.service";

const ChatSandbox = ({ isReadingChat, isReadingMessage }) => {
  const { id } = useParams();
  console.log(id);

  const Navigate = useNavigate();

  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const ui = useSelector((state) => state.ui);
  const [chatId, setChatId] = useState(null);

  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentStart, setCurrentStart] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const lastFetchedRef = useRef(null); // 🧠 Track last fetched chatId
  const messagesContainerRef = useRef(null);
  const [chatAuthor, setchatAuthor] = useState(true);

  const cancelRef = useRef(null);

  const playSound = () => {
    const audio = new Audio(screenShotAudio);
    audio.play();
  };

  const handleDeleteChat = () => {
    dispatch(clearChat());
    setChatId(null);
  };

  useEffect(() => {
    dispatch(clearMessages());
    sandboxSocket.on("response", (data) => {
      try {
        if (!data.success) {
          dispatch(
            addMessage({
              role: "model",
              content: data.message,
            })
          );
          scrollToFullBottom();
          throw new Error(data.message);
        }
        dispatch(addMessage({ role: "model", content: data.content.text }));
        smartScroll();

        if (!chatId && data.content.chatId) setChatId(data.content.chatId);
      } catch (error) {
        toast.error(error.message);
      } finally {
        dispatch(setTyping(false));
        dispatch(setWaiting(false));
        dispatch(setCancelRequestId(null));
      }
    });
    return () => {
      sandboxSocket.off("response");
      sandboxSocket.disconnect();
    };
  }, []);
  const handlers = {
    sendMessage: async ({ content }) => {
      if (!content || ui.isWaitingForResponse) return;
      dispatch(addMessage({ role: "user", content }));
      dispatch(setWaiting(true));
      dispatch(setTyping(true));

      setTimeout(() => scrollToFullBottom(), 100);

      if (!sandboxSocket.connected) {
        setTimeout(() => {
          dispatch(
            addMessage({
              role: "model",
              content:
                "Failed to connect with server, check you internet connection or try again later!",
            })
          );
          scrollToFullBottom();
          dispatch(setTyping(false));
          dispatch(setWaiting(false));
          dispatch(setCancelRequestId(null));
        }, 1000);
        return;
      }
      sandboxSocket.connect();
      sandboxSocket.emit(
        "message",
        JSON.stringify({ message: content, chatId: chatId || "null" })
      );
    },
    cancelRequest: () => {
      if (cancelRef.current) {
        clearTimeout(cancelRef.current);
        cancelRef.current = null;
      }
      dispatch(setWaiting(false));
      dispatch(setTyping(false));
      dispatch(setCancelRequestId(null));
    },
    copyMessage: (content, messageId) => {
      const plainText = mdToPlainText(content);
      navigator.clipboard.writeText(plainText);
      dispatch(setCopyState({ messageId, value: true }));
      setTimeout(
        () => dispatch(setCopyState({ messageId, value: false })),
        1500
      );
    },
    screenshot: (messageId) => {
      playSound();
      dispatch(setScreenshotState({ messageId, value: true }));
      setTimeout(
        () => dispatch(setScreenshotState({ messageId, value: false })),
        1500
      );
    },
    readAloud: (content, messageId) => {
      const readingId = ui.readingMessageId;

      // Remove Markdown symbols
      const plainText = mdToPlainText(content);

      if (readingId === messageId) {
        speechSynthesis.cancel();
        dispatch(setReadingMessage(null));
      } else {
        if ("speechSynthesis" in window) {
          speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(plainText.trim());
          utter.onend = () => dispatch(setReadingMessage(null));
          speechSynthesis.speak(utter);
          dispatch(setReadingMessage(messageId));
        }
      }
    },

    setModel: (modelId) => dispatch(setSelectedModel(modelId)),
  };

  const getChatMessages = async (id, start = 0, append = false) => {
    try {
      const response = await axiosInstance.get(`/chat/${id}?start=${start}`, {
        withCredentials: true,
      });
      console.log(response.data);

      const chat = response.data.chat;
      setchatAuthor(chat.author);
      const contents = response.data.messages.contents;
      const hasMoreMessages = response.data.messages.hasMore;

      document.title = chat.title || "Chat";

      const formattedMessages = contents.flatMap((item) => {
        return [
          { role: "user", content: item.userMessage },
          {
            loved: item.loved,
            id: item._id,
            role: "model",
            content: item.aiResponse,
          },
        ];
      });

      if (append) {
        // Prepend older messages to the beginning
        dispatch(setMessages([...formattedMessages, ...messages]));
      } else {
        // Initial load - replace all messages
        dispatch(setMessages(formattedMessages));
        setCurrentStart(0);
        setIsInitialLoad(true);
        setTimeout(() => {
          scrollToFullBottom();
          // Enable scroll listener after animation completes
          setTimeout(() => setIsInitialLoad(false), 500);
        }, 100);
      }

      setHasMore(hasMoreMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      toast.error("Failed to load chat messages");
      Navigate("/");
    }
  };
  // 🟢 Load more messages when scrolling to top
  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMore || !chatId) return;

    setIsLoadingMore(true);
    const newStart = currentStart + 20; // 20 is the limit from backend

    try {
      // Save current scroll position
      const container = messagesContainerRef.current;
      const previousScrollHeight = container?.scrollHeight || 0;

      await getChatMessages(chatId, newStart, true);
      setCurrentStart(newStart);

      // Restore scroll position after new messages are added
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 50);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 🟢 Handle scroll event
  const handleScroll = (e) => {
    // Prevent scroll handler during initial load/animation
    if (isInitialLoad) return;

    const container = e.target;
    const scrollTop = container.scrollTop;

    // Trigger load when user is 1000px from the top
    if (scrollTop < 1000 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  // 🧩 Prevent double fetching
  const safeGetChatMessages = (id) => {
    if (!id) return;
    if (lastFetchedRef.current === id) return;
    lastFetchedRef.current = id;
    getChatMessages(id);
  };

  // 🟢 On first mount → use URL param
  useEffect(() => {
    if (id) {
      setChatId(id);
      safeGetChatMessages(id);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    if (!isReadingChat || !isReadingMessage) {
      return;
    }
    const response = getChatMessages(chatId);
    console.log(response);
  }, [isReadingChat, isReadingMessage]);

  return (
    <div className={`flex-1 flex flex-col h-screen dark:bg-[#212121] bg-white`}>
      <TopBarSandbox
        setShowModel={() => {}}
        models={[
          { id: "zen-1.5", name: "zen-1.5" },
          { id: "zen-2.0", name: "zen-2.0" },
          { id: "zen-3.5", name: "zen-3.5" },
          { id: "zen-4.0", name: "zen-4.0" },
        ]}
        selectedModel={ui.selectedModel}
        handleDeleteChat={handleDeleteChat}
        isReading={isReadingChat || isReadingMessage}
      />

      <MessagesList
        messages={messages}
        isTyping={ui.isTyping}
        handlers={handlers}
        uiState={ui}
        onScroll={handleScroll}
        isReading={isReadingMessage || isReadingChat}
        author={chatAuthor}
      />

      <Input
        onSend={(content) => handlers.sendMessage({ content })}
        onCancel={() => handlers.cancelRequest()}
        isWaiting={ui.isWaitingForResponse}
        isReading={isReadingMessage || isReadingChat}
      />
    </div>
  );
};

export default ChatSandbox;
