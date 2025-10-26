import * as htmlToImage from 'html-to-image';

/**
 * Capture clean, styled screenshots of Markdown/Code blocks rendered with Tailwind + rehype-highlight.
 */
export const takeScreenshot = async (element, fileName) => {
	if (!element) return;

	try {
		// Wait until fonts are ready
		if (document.fonts && document.fonts.ready) {
			await document.fonts.ready;
		}

		// Detect theme (dark/light)
		const isDark = document.documentElement.classList.contains('dark');
		const bgColor = isDark ? '#212121' : '#ffffff';

		const dataUrl = await htmlToImage.toPng(element, {
			backgroundColor: bgColor,
			pixelRatio: 2,
			cacheBust: true,
			skipFonts: false,
			quality: 1,
			style: {
				transform: 'none',
				filter: 'none',
				boxShadow: 'none',
			},
		});

		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
		link.click();
	} catch (err) {
		console.error('⚠️ Screenshot failed:', err);
	}
};
