import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import {
  addMessage,
  changeLovedMessage,
  clearMessages,
  setMessages,
} from "../../features/messages/messagesSlice";
import {
  setTyping,
  setWaiting,
  setCancelRequestId,
  setCopyState,
  setReadingMessage,
  setSelectedModel,
} from "../../features/ui/uiSlice";
import { addOneChat, setChatId } from "../../features/chats/chatSlice";

import { userSocket } from "../../sockets/client.socket";
import { scrollToFullBottom, smartScroll } from "../../utils/autoScroll.util";

import TopBar from "./TopBar";
import MessagesList from "./MessagesList";
import Input from "./Input";

import "../../css/chat.css";
import axiosInstance from "../../services/axios.service";

const Chat = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { id } = useParams();

  const messages = useSelector((state) => state.messages.messages);
  const ui = useSelector((state) => state.ui);
  const chatId = useSelector((state) => state.chats.chatId);
  const [isNewChat, setIsNewChat] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentStart, setCurrentStart] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isTemp = useSelector((state) => state.chats.isTemp);

  const cancelRef = useRef(null);
  const lastFetchedRef = useRef(null); // 🧠 Track last fetched chatId
  const messagesContainerRef = useRef(null);

  // 🟢 Fetch chat messages from backend
  const getChatMessages = async (id, start = 0, append = false) => {
    try {
      const response = await axiosInstance.get(`/chat/${id}?start=${start}`, {
        withCredentials: true,
      });

      const chat = response.data.chat;
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
    if (!isNewChat) {
      getChatMessages(id);
    }
  };

  // 🟢 On first mount → use URL param
  useEffect(() => {
    if (id) {
      dispatch(setChatId(id));
      safeGetChatMessages(id);
    }
  }, []); // Run only once on mount

  // 🟢 When Redux chatId changes (sidebar click)
  useEffect(() => {
    if (chatId && chatId !== id && !isTemp) {
      Navigate(`/chat/${chatId}`, { replace: true });
      safeGetChatMessages(chatId);
    }
  }, [chatId]);

  // 🟢 Socket listener
  useEffect(() => {
    dispatch(clearMessages());

    userSocket.on("response", (data) => {
      try {
        if (!data.success) {
          dispatch(addMessage({ role: "model", content: data.message }));
          scrollToFullBottom();
          throw new Error(data.message);
        }

        dispatch(
          addMessage({ id: data.id, role: "model", content: data.content.text })
        );

        console.log(data);

        if (data.isNewChat && !data.tempChat) {
          dispatch(
            addOneChat({ title: data.content.title, id: data.content.chatId })
          );
          document.title = data.content.title;
          Navigate(`/chat/${data.content.chatId}`, { replace: true });
        }
        setIsNewChat(data.isNewChat);
        if (!chatId && data.content.chatId) {
          dispatch(setChatId(data.content.chatId));
        }
        if (!data.isNewChat) {
          smartScroll();
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        dispatch(setTyping(false));
        dispatch(setWaiting(false));
        dispatch(setCancelRequestId(null));
      }
    });

    return () => {
      userSocket.disconnect();
      userSocket.off("response");
    };
  }, []);

  // 🧩 Handlers (unchanged except simplified sendMessage)
  const handlers = {
    sendMessage: async ({ content }) => {
      if (!content || ui.isWaitingForResponse) return;
      dispatch(addMessage({ role: "user", content }));
      dispatch(setWaiting(true));
      dispatch(setTyping(true));
      setIsInitialLoad(true);

      setTimeout(() => {
        scrollToFullBottom();
        setTimeout(() => setIsInitialLoad(false), 500);
      }, 100);

      userSocket.io.opts.query = { temp: isTemp ? "true" : "false" };

      userSocket.connect();
      userSocket.emit(
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
      navigator.clipboard.writeText(content);
      dispatch(setCopyState({ messageId, value: true }));
      setTimeout(
        () => dispatch(setCopyState({ messageId, value: false })),
        1500
      );
    },
    loveMessage: async (messageId) => {
      if (isTemp) {
        toast.error("Cannot like temporary chat!");
        return;
      }
      try {
        const response = await axiosInstance.patch(
          `/chat/love/${messageId}`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(
            changeLovedMessage({ messageId, loved: response.data.loved })
          );
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("loveMessage error:", error);
        // Prefer server message if available
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update message"
        );
      }
    },
    readAloud: (content, messageId) => {
      const readingId = ui.readingMessageId;
      if (readingId === messageId) {
        speechSynthesis.cancel();
        dispatch(setReadingMessage(null));
      } else {
        if ("speechSynthesis" in window) {
          speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(content);
          utter.onend = () => dispatch(setReadingMessage(null));
          speechSynthesis.speak(utter);
          dispatch(setReadingMessage(messageId));
        }
      }
    },
    setModel: (modelId) => dispatch(setSelectedModel(modelId)),
  };

  return (
    <div className="flex-1 flex flex-col h-screen dark:bg-[#212121] bg-white">
      <TopBar
        setShowModel={() => {}}
        models={[
          { id: "zen-1.5", name: "zen-1.5" },
          { id: "zen-2.0", name: "zen-2.0" },
          { id: "zen-3.5", name: "zen-3.5" },
          { id: "zen-4.0", name: "zen-4.0" },
        ]}
        selectedModel={ui.selectedModel}
        setSelectedModel={(id) => handlers.setModel(id)}
        onShareChat={() => {}}
      />

      <MessagesList
        messages={messages}
        isTyping={ui.isTyping}
        handlers={handlers}
        uiState={ui}
        chatId={chatId}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onScroll={handleScroll}
        containerRef={messagesContainerRef}
      />

      <Input
        onSend={(content) => handlers.sendMessage({ content })}
        onCancel={() => handlers.cancelRequest()}
        isWaiting={ui.isWaitingForResponse}
      />
    </div>
  );
};

export default Chat;
