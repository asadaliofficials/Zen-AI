import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});

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

	const handleInputChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = e => {
		e.preventDefault();
		console.log('Form submitted:', { isSignUp, formData });
		// Handle form submission here
	};

	const toggleForm = signUp => {
		setIsSignUp(signUp);
		setFormData({
			name: '',
			email: '',
			password: '',
		});
	};

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: 'easeOut' },
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: { duration: 0.2, ease: 'easeIn' },
		},
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${
				isDark ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900'
			}`}
		>
			{/* Header */}
			<div className="flex justify-between items-center px-6 py-4">
				<div className="flex items-center space-x-2">
					<div
						className={`w-8 h-8 rounded-lg flex items-center justify-center ${
							isDark ? 'bg-white' : 'bg-black'
						}`}
					>
						<svg
							className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`}
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
						</svg>
					</div>
					<span className="text-xl font-semibold">ChatGPT</span>
				</div>

				{/* Theme Toggle */}
				<button
					onClick={() => setIsDark(!isDark)}
					className={`p-2 rounded-lg transition-colors ${
						isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
					}`}
				>
					{isDark ? (
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					) : (
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Main Content */}
			<div className="flex flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-md">
					{/* Welcome Message */}
					<div className="text-center mb-8">
						<h1 className={`text-3xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
							Welcome to ChatGPT
						</h1>
						<p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
							{isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
						</p>
					</div>

					{/* Auth Form */}
					<div
						className={`p-8 rounded-2xl border ${
							isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'
						} shadow-lg`}
					>
						{/* Tab Navigation */}
						<div className="flex mb-8 border-b border-gray-200 dark:border-zinc-700">
							<button
								onClick={() => toggleForm(true)}
								className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
									isSignUp
										? isDark
											? 'text-blue-400'
											: 'text-black'
										: isDark
										? 'text-zinc-400'
										: 'text-gray-500'
								}`}
							>
								Sign Up
								{isSignUp && (
									<motion.div
										className={`absolute bottom-0 left-0 right-0 h-0.5 ${
											isDark ? 'bg-blue-400' : 'bg-black'
										}`}
										layoutId="activeTab"
										transition={{ duration: 0.2, ease: 'easeOut' }}
									/>
								)}
							</button>
							<button
								onClick={() => toggleForm(false)}
								className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
									!isSignUp
										? isDark
											? 'text-blue-400'
											: 'text-black'
										: isDark
										? 'text-zinc-400'
										: 'text-gray-500'
								}`}
							>
								Login
								{!isSignUp && (
									<motion.div
										className={`absolute bottom-0 left-0 right-0 h-0.5 ${
											isDark ? 'bg-blue-400' : 'bg-black'
										}`}
										layoutId="activeTab"
										transition={{ duration: 0.2, ease: 'easeOut' }}
									/>
								)}
							</button>
						</div>

						<AnimatePresence mode="wait">
							<motion.form
								key={isSignUp ? 'signup' : 'signin'}
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
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
									>
										<label
											htmlFor="name"
											className={`block text-sm font-medium mb-2 ${
												isDark ? 'text-zinc-300' : 'text-black'
											}`}
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
											className={`w-full px-4 py-3 rounded-lg border transition-colors ${
												isDark
													? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500'
													: 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
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
										className={`block text-sm font-medium mb-2 ${
											isDark ? 'text-zinc-300' : 'text-black'
										}`}
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
										className={`w-full px-4 py-3 rounded-lg border transition-colors ${
											isDark
												? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500'
												: 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
										} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
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
										className={`block text-sm font-medium mb-2 ${
											isDark ? 'text-zinc-300' : 'text-black'
										}`}
									>
										Password
									</label>
									<input
										type="password"
										id="password"
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										required
										className={`w-full px-4 py-3 rounded-lg border transition-colors ${
											isDark
												? 'bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500'
												: 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
										} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
										placeholder="Enter your password"
									/>
								</motion.div>

								{/* Submit Button */}
								<motion.button
									type="submit"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.3 }}
									className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
										isDark
											? 'bg-white hover:bg-zinc-100 text-zinc-900'
											: 'bg-black hover:bg-gray-800 text-white'
									} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
								>
									{isSignUp ? 'Create account' : 'Sign in'}
								</motion.button>
							</motion.form>
						</AnimatePresence>
					</div>

					{/* Footer */}
					<div className="mt-8 text-center">
						<p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
							By continuing, you agree to our Terms of Service and Privacy Policy.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
