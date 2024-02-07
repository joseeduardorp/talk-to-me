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
	const [chat, setChat] = useState<IChatMessage[]>([]);

	useEffect(() => {
		socket?.on('chat', (data) => {
			console.log('message:', data);
			setChat((prev) => [...prev, data]);
		});
	}, [socket]);

	function sendMessage(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (currentMsg.current && currentMsg.current.value !== '') {
			const sendMsgToServer = {
				message: currentMsg.current.value,
				username: 'José',
				roomId,
				time: new Date().toLocaleTimeString(),
			};

			socket?.emit('chat', sendMsgToServer);
			setChat((prev) => [...prev, sendMsgToServer]);

			currentMsg.current.value = '';
		}
	}

	return (
		<aside className="p-4 pl-0 w-[500px] h-full hidden md:block">
			<div className="p-4 h-full bg-gray-900 rounded-md flex flex-col gap-4">
				<div className="h-full space-y-3 ">
					{chat.map((chat, index) => (
						<div key={index} className="py-2 px-3 bg-gray-950 rounded">
							<div className="flex text-pink-400 space-x-2">
								<span>{chat.username}</span>
								<span>{chat.time}</span>
							</div>

							<div className="mt-2 text-sm">
								<p>{chat.message}</p>
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
	);
}
