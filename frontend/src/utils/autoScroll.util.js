const findScrollContainer = el => {
	let cur = el;
	while (cur) {
		const style = window.getComputedStyle(cur);
		const overflowY = style.overflowY;
		if ((overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight) {
			return cur;
		}
		cur = cur.parentElement;
	}
	return null;
};

export const scrollToFullBottom = () => {
	// Get the scrollable container
	const container = document.querySelector('.messages-container');
	if (!container) return;

	// Wait for next frame to ensure layout is updated (React just rendered)
	requestAnimationFrame(() => {
		// Optional: wait one more frame for animation-heavy DOM (Markdown, syntax highlighting)
		requestAnimationFrame(() => {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: 'smooth',
			});
		});
	});
};

export const smartScroll = () => {
	// Find container reliably (start from any message element)
	const anyMessage = document.querySelector('.messages-container .flex.mt-10');
	if (!anyMessage) return;
	const container =
		findScrollContainer(anyMessage) || document.querySelector('.messages-container');
	if (!container) return;

	// Don't auto-scroll if user is far from bottom (reading older messages)
	const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
	const DISTANCE_THRESHOLD = 2000; // px; tune as you like
	if (distanceFromBottom > DISTANCE_THRESHOLD) {
		// user is reading old messages — do not disturb
		return;
	}

	// Wait a frame to ensure the DOM layout has updated (helps with streaming / animations)
	requestAnimationFrame(() => {
		// second frame to be extra-safe (keeps it reliable)
		requestAnimationFrame(() => {
			// Find the last user message element
			const userMessages = container.querySelectorAll('.user-message');
			if (!userMessages.length) {
				// fallback: scroll to bottom
				container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
				return;
			}

			const lastUser = userMessages[userMessages.length - 1];

			// Last message element in container (the AI response)
			// We must find the actual message wrapper (the .flex.mt-10 element) as the "last message"
			const allMessageWrappers = container.querySelectorAll('.flex.mt-10');
			const lastMessageWrapper = allMessageWrappers[allMessageWrappers.length - 1];
			if (!lastMessageWrapper) {
				container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
				return;
			}

			// Get bounding rects relative to viewport
			const containerRect = container.getBoundingClientRect();
			const userRect = lastUser.getBoundingClientRect();
			const aiRect = lastMessageWrapper.getBoundingClientRect();

			// Compute positions relative to container's scrollTop
			// position of user's top inside container content (in px)
			const userTopRel = userRect.top - containerRect.top + container.scrollTop;
			const aiBottomRel =
				aiRect.top - containerRect.top + container.scrollTop + lastMessageWrapper.offsetHeight;

			const containerHeight = container.clientHeight;

			// If AI response fits below user's top within container viewport: scroll fully to bottom
			if (aiBottomRel - userTopRel <= containerHeight) {
				container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
			} else {
				// Otherwise scroll so the last user message is at (top - 50px)
				const desiredTop = Math.max(0, userTopRel - 50);
				container.scrollTo({ top: desiredTop, behavior: 'smooth' });
			}
		});
	});
};
