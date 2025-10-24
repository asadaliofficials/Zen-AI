import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export const MarkdownMessage = ({ content }) => {
	return (
		<div
			className="prose max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:mb-3
        prose-p:leading-relaxed prose-p:mb-3
        prose-ul:pl-6 prose-ol:pl-6 prose-li:my-1
        prose-code:text-sm prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-[#424242] prose-code:px-1
        prose-pre:bg-[#272822] prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
        prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300"
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
				components={{
					code({ inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						const language = match ? match[1] : '';
						const [copied, setCopied] = useState(false);

						// ✅ Inline code (`req`, `res`)
						if (inline || !match) {
							return (
								<code
									className="bg-gray-100 dark:bg-[#424242] text-[90%] font-mono rounded px-1 py-0.5"
									{...props}
								>
									{children}
								</code>
							);
						}

						// ✅ Multiline fenced code blocks only
						const handleCopy = async () => {
							try {
								await navigator.clipboard.writeText(String(children).trim());
								setCopied(true);
								setTimeout(() => setCopied(false), 1500);
							} catch (err) {
								console.error('Copy failed', err);
							}
						};

						return (
							<div className="relative my-2 not-prose">
								{/* Top bar */}
								<div className="absolute top-0 left-0 right-0 flex justify-between items-center text-xs text-gray-400 dark:text-gray-300 bg-[#1e1e1e] px-3 py-1 rounded-t-md border-b border-gray-700">
									<span className="font-mono">{language || 'text'}</span>
									<button
										onClick={handleCopy}
										className="text-xs px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
									>
										{copied ? 'Copied!' : 'Copy'}
									</button>
								</div>

								{/* Code block (no top padding so it attaches to bar) */}
								<pre className="bg-[#272822] text-gray-100 rounded-md pt-7 pb-3 px-4 overflow-x-auto">
									<code className={className} {...props}>
										{children}
									</code>
								</pre>
							</div>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};
