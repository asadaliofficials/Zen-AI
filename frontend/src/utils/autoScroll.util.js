const findScrollContainer = (el) => {
  let cur = el;
  while (cur) {
    const style = window.getComputedStyle(cur);
    const overflowY = style.overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      cur.scrollHeight > cur.clientHeight
    ) {
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
    findScrollContainer(anyMessage) ||
    document.querySelector('.messages-container');
  if (!container) return;

  // Don't auto-scroll if user is far from bottom (reading older messages)
  const distanceFromBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight;
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

      // Find all message wrappers and get the last AI message
      // AI messages are those that don't have .user-message class
      const allMessageWrappers = container.querySelectorAll('.flex.mt-10');
      let lastAiMessageWrapper = null;

      // Loop backwards to find the last AI message (one without user-message class)
      for (let i = allMessageWrappers.length - 1; i >= 0; i--) {
        if (!allMessageWrappers[i].classList.contains('user-message')) {
          lastAiMessageWrapper = allMessageWrappers[i];
          break;
        }
      }

      if (!lastAiMessageWrapper) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return;
      }

      // Get bounding rects relative to viewport
      const containerRect = container.getBoundingClientRect();
      const userRect = lastUser.getBoundingClientRect();
      const aiRect = lastAiMessageWrapper.getBoundingClientRect();

      // Compute positions relative to container's scrollTop
      const userTopRel = userRect.top - containerRect.top + container.scrollTop;
      const aiTopRel = aiRect.top - containerRect.top + container.scrollTop;
      const aiBottomRel = aiTopRel + lastAiMessageWrapper.offsetHeight;

      const containerHeight = container.clientHeight;
      const topOffset = 100; // Distance from top where AI message should start

      // Check if both user and AI messages fit in viewport
      const totalHeight = aiBottomRel - userTopRel;

      if (totalHeight <= containerHeight) {
        // Both fit - scroll to bottom to show everything
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } else {
        // Doesn't fit - position AI message at topOffset from top
        const desiredTop = Math.max(0, aiTopRel - topOffset);
        container.scrollTo({ top: desiredTop, behavior: 'smooth' });
      }
    });
  });
};
