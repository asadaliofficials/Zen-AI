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
        prose-code:text-sm prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
        prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300"
		>
			<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
				{content}
			</ReactMarkdown>
		</div>
	);
};
