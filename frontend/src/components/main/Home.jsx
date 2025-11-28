import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // on anywhere click close sidebar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarOpen &&
        window.innerWidth <= 1024 &&
        !event.target.closest('.menu-button')
      ) {
        // Check if click is outside sidebar - using the motion.div as reference
        const sidebar = document.querySelector(
          '.fixed.lg\\:relative.top-0.left-0'
        );
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarOpen]);

  const [theme, setTheme] = useState(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'white';
    } else {
      return 'black';
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, [sidebarOpen]);

  return (
    <div className={`flex h-[100dvh] dark:bg-[#181818] bg-white`}>
      <Sidebar
        isOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onToggle={toggleSidebar}
        theme={theme}
      />
      <div className='flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden'>
        <div className='lg:hidden  flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <button
            onClick={toggleSidebar}
            className={`menu-button p-2 rounded-lg transition-colors dark:hover:bg-gray-800 hover:bg-gray-100`}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke={theme}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
          <h1 className={`text-lg font-semibold dark:text-white text-black`}>
            Zen-AI
          </h1>
          <div className='w-10'></div>
        </div>

        <Chat />
      </div>
    </div>
  );
};

export default Home;
