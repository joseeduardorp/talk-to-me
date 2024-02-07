import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { SocketContext } from '@/contexts/SocketContext';

interface IChatMessage {
	message: string;
	username: string;
	roomId: string;
	time: string;
}

export default function Chat({ roomId }: { roomId: string }) {
	const { socket } = useContext(SocketContext);
	const currentMsg = useRef<HTMLInputElement>(null);
	const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
	const [showChat, setShowChat] = useState<boolean>(false);

	useEffect(() => {
		socket?.on('chat', (data) => {
			console.log('message:', data);
			setChatMessages((prev) => [...prev, data]);
		});
	}, [socket]);

	function sendMessage(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (currentMsg.current && currentMsg.current.value !== '') {
			const username = sessionStorage.getItem('username') || 'Fulano';

			const sendMsgToServer = {
				message: currentMsg.current.value,
				username,
				roomId,
				time: new Date().toLocaleTimeString(),
			};

			socket?.emit('chat', sendMsgToServer);
			setChatMessages((prev) => [...prev, sendMsgToServer]);

			currentMsg.current.value = '';
		}
	}

	function toggleShowChat() {
		setShowChat((prev) => !prev);
	}

	return (
		<>
			<aside
				className={`p-4 pl-0 w-[350px] md:w-[500px] h-full shadow-2xl absolute top-0 right-0 ${
					showChat ? 'block' : 'hidden'
				} md:block md:static`}
			>
				<div className="p-4 h-full bg-gray-900 rounded-md flex flex-col gap-4">
					<button
						onClick={toggleShowChat}
						className="h-6 w-6 self-end text-xl md:hidden"
					>
						x
					</button>

					<div className="p-2 h-full overflow-y-auto space-y-3 ">
						{chatMessages.map((msg, index) => (
							<div key={index} className="py-2 px-3 bg-gray-950 rounded">
								<div className="flex text-pink-400 space-x-2">
									<span>{msg.username}</span>
									<span>{msg.time}</span>
								</div>

								<div className="mt-2 text-sm">
									<p>{msg.message}</p>
								</div>
							</div>
						))}
					</div>

					<form className="w-full" onSubmit={sendMessage}>
						<div className="flex relative">
							<input
								type="text"
								placeholder="Mensagem"
								ref={currentMsg}
								className="px-3 py-2 w-full bg-gray-950 rounded-md"
							/>

							<button type="submit">
								<Image
									src="/send.png"
									width={20}
									height={20}
									alt="Send"
									className="absolute right-2 top-2.5 cursor-pointer"
								/>
							</button>
						</div>
					</form>
				</div>
			</aside>

			{!showChat && (
				<button
					onClick={toggleShowChat}
					className="py-2.5 px-5 bg-gray-900 rounded-full shadow-2xl absolute right-6 bottom-0 font-semibold md:hidden"
				>
					Chat
				</button>
			)}
		</>
	);
}
