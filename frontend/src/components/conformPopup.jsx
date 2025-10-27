import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmPopup = ({
	show,
	title,
	description,
	onCancel,
	onConfirm,
	confirmLabel = 'Confirm',
}) => {
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		let timer;
		if (isProcessing) {
			timer = setTimeout(() => {
				onConfirm();
				setIsProcessing(false);
			}, 3000);
		}
		return () => clearTimeout(timer);
	}, [isProcessing, onConfirm]);

	const handleConfirmClick = () => {
		setIsProcessing(true);
	};

	return (
		<AnimatePresence>
			{show && (
				<>
					{/* Background overlay */}
					<motion.div
						className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>

					{/* Popup box */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="fixed z-60 inset-0 flex items-center justify-center"
					>
						<div
							className="w-full max-w-sm rounded-2xl shadow-lg p-6
							bg-white text-black 
							dark:bg-[#1e1e1e] dark:text-white"
						>
							{/* Title */}
							<h2 className="text-lg font-semibold mb-2">{title}</h2>

							{/* Description */}
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{description}</p>

							{/* Buttons or Loader */}
							<div className="flex justify-end space-x-3 min-h-[40px]">
								{isProcessing ? (
									<div className="flex justify-center w-full">
										<div className="w-6 h-6 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
									</div>
								) : (
									<>
										<button
											onClick={onCancel}
											className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
												text-gray-700 dark:text-gray-300 
												hover:bg-gray-100 dark:hover:bg-[#333]
												transition-colors duration-200"
										>
											Cancel
										</button>

										<button
											onClick={handleConfirmClick}
											className="cursor-pointer px-4 py-2 rounded-md 
												bg-red-600 text-white 
												hover:bg-red-700 
												transition-colors duration-200"
										>
											{confirmLabel}
										</button>
									</>
								)}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ConfirmPopup;
