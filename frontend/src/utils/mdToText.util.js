const mdToPlainText = content => {
	return content
		// Remove triple backticks and language names (keep code)
		.replace(/```[\s\S]*?```/g, match =>
			match
				.replace(/```[a-zA-Z]*\n?/, '') // remove starting ```
				.replace(/```$/, '') // remove ending ```
		)
		// Remove inline backticks but keep text inside
		.replace(/`([^`]+)`/g, '$1')
		// Remove bold/italic markers
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/\*(.*?)\*/g, '$1')
		// Remove images
		.replace(/!\[.*?\]\(.*?\)/g, '')
		// Keep link text, remove URLs
		.replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
		// Remove markdown headers (#), blockquotes (>), and list symbols (-, *)
		.replace(/^\s{0,3}(#{1,6}|>|\*|-)\s+/gm, '')
		// Replace multiple newlines with a single newline
		.replace(/\n{2,}/g, '\n')
		.trim();
};

export default mdToPlainText;
