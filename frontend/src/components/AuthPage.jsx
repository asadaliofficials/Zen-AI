import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../services/axios.service";

const AuthPage = () => {
  const Navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // System theme detection
  // useEffect(() => {
  // 	const checkSystemTheme = () => {
  // 		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // 		setIsDark(prefersDark);
  // 	};

  // 	checkSystemTheme();

  // 	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  // 	mediaQuery.addEventListener('change', checkSystemTheme);

  // 	return () => mediaQuery.removeEventListener('change', checkSystemTheme);
  // }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 1000; // 1 second minimum

    try {
      if (isSignUp) {
        await axiosInstance.post("/auth/sign-up", formData, {
          withCredentials: true,
        });
        toast.success("Account created successfully!");
      } else {
        await axiosInstance.post("/auth/login", formData, {
          withCredentials: true,
        });
        toast.success("Logged in successfully!");
      }

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      Navigate("/");
    } catch (error) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      // Handle different types of errors
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          // Validation errors
          data.errors.forEach((errorItem) => {
            toast.error(errorItem.msg);
          });
        } else if (status === 409) {
          // Email already registered
          toast.error(data.message || "Email already registered");
        } else if (status === 401) {
          // Invalid credentials
          toast.error(data.message || "Invalid email or password");
        } else {
          // Other server errors
          toast.error(
            data.message || "Something went wrong. Please try again."
          );
        }
      } else if (error.request) {
        // Network error
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = (signUp) => {
    setIsSignUp(signUp);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-white text-gray-900 dark:bg-zinc-900 dark:text-white`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded flex items-center justify-center">
            <img src="images/logo.png" alt="logo" />
          </div>
          <span className="text-xl font-semibold">Zen-AI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 dark:text-white text-black">
              Welcome to ZEN AI
            </h1>
            <p className="text-sm dark:text-zinc-400 text-gray-600">
              {isSignUp
                ? "Create your account to get started"
                : "Sign in to your account"}
            </p>
          </div>

          {/* Auth Form */}
          <div className="p-8 rounded-2xl border dark:bg-zinc-800 dark:border-zinc-700 bg-white border-gray-200 shadow-lg">
            {/* Tab Navigation */}
            <div className="flex mb-8 border-b border-gray-200 dark:border-zinc-700">
              <button
                onClick={() => toggleForm(true)}
                className={`flex-1 py-3 px-4 text-center cursor-pointer font-medium transition-colors relative ${
                  isSignUp
                    ? "text-blue-400"
                    : "text-gray-500 dark:text-zinc-400"
                }`}
              >
                Sign Up
                {isSignUp && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 dark:bg-blue-400"
                    layoutId="activeTab"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
              </button>
              <button
                onClick={() => toggleForm(false)}
                className={`flex-1 py-3 px-4 cursor-pointer text-center font-medium transition-colors relative ${
                  !isSignUp
                    ? "text-blue-400"
                    : "text-gray-500 dark:text-zinc-400"
                }`}
              >
                Login
                {!isSignUp && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 dark:bg-blue-400"
                    layoutId="activeTab"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? "signup" : "signin"}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name field for signup */}
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-black dark:text-zinc-300"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={isSignUp}
                      className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      placeholder="Enter your full name"
                    />
                  </motion.div>
                )}

                {/* Email field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-black dark:text-zinc-300"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Enter your email"
                  />
                </motion.div>

                {/* Password field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2 text-black dark:text-zinc-300"
                  >
                    Password
                  </label>
                  <input
                    type="text" // visible password as requested
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="Enter your password"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  disabled={isLoading}
                  className={`w-full h-12 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100`}
                >
                  {isLoading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={42}
                      height={42}
                      viewBox="0 0 24 24"
                      className="animate-spin"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth={1.3}
                        d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12"
                      >
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          dur="560ms"
                          from="0,12,12"
                          repeatCount="indefinite"
                          to="360,12,12"
                          type="rotate"
                        ></animateTransform>
                      </path>
                    </svg>
                  ) : isSignUp ? (
                    "Create account"
                  ) : (
                    "Sign in"
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
