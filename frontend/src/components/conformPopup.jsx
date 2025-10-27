import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmPopup = ({
	show,
	title,
	description,
	onCancel,
	onConfirm,
	confirmLabel = 'Confirm',
}) => {
	return (
		<AnimatePresence>
			{show && (
				<>
					{/* Background overlay */}
					<motion.div
						className="absolute w-full h-full top-0 left-0 inset-0  bg-black/40 backdrop-blur-xs z-50"
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

							{/* Buttons */}
							<div className="flex justify-end space-x-3">
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
									onClick={onConfirm}
									className="cursor-pointer px-4 py-2 rounded-md 
                        bg-red-600 text-white 
                        hover:bg-red-700 
                        transition-colors duration-200"
								>
									{confirmLabel}
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ConfirmPopup;
