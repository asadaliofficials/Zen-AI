// utils/getScreenshotName.js

export const getRandomName = () => {
	const date = new Date();

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);

	// Random 4-digit number
	const randomNum = Math.floor(1000 + Math.random() * 90000);

	return `${day}-${month}-${year}-zen-ai-${randomNum}.png`;
};
