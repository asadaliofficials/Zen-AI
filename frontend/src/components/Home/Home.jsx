import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';

const Home = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isDark, setIsDark] = useState(false);

	// System theme detection
	useEffect(() => {
		const checkSystemTheme = () => {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setIsDark(prefersDark);
		};

		checkSystemTheme();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', checkSystemTheme);

		return () => mediaQuery.removeEventListener('change', checkSystemTheme);
	}, []);

	// Handle sidebar toggle
	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	// Close sidebar on mobile when screen size changes
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setSidebarOpen(true);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

			{/* Chat Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Mobile Header */}
				<div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<button
						onClick={toggleSidebar}
						className={`p-2 rounded-lg transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
						}`}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
						Zen-AI
					</h1>
					<div className="w-10"></div>
				</div>

				{/* Chat Component */}
				<Chat />
			</div>
		</div>
	);
};

export default Home;
