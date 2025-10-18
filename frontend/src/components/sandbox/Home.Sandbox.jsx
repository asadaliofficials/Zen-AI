import ChatSandbox from './Chat.sandbox';

const HomeSandbox = () => {
	console.log('heee');
	return (
		<div className={`flex h-screen dark:bg-gray-900 bg-white`}>
			{/* Chat Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Chat Component */}
				<ChatSandbox />
			</div>
		</div>
	);
};

export default HomeSandbox;
