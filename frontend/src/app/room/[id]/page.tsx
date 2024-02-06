'use client';
import { useContext, useEffect, useRef } from 'react';

import Chat from '@/components/Chat';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

import { SocketContext } from '@/contexts/SocketContext';

export default function Room({ params }: { params: { id: string } }) {
	const { socket } = useContext(SocketContext);
	const localStream = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		socket?.on('connect', async () => {
			console.log('cliente conectado');

			socket.emit('subscribe', {
				roomId: params.id,
				socket: socket.id,
			});

			await initCamera();
		});
	}, [socket]);

	const initCamera = async () => {
		const video = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: {
				noiseSuppression: true,
				echoCancellation: true,
			},
		});

		if (localStream.current) {
			localStream.current.srcObject = video;
		}
	};

	return (
		<main className="h-screen">
			<Header />

			<div className="flex h-[73%]">
				<div className="m-3 w-full md:w-[80%]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="p-2 w-full h-full bg-gray-950 rounded-md relative">
							<video
								className="w-full h-full"
								autoPlay
								playsInline
								ref={localStream}
							/>
							<span className="absolute bottom-2">José Eduardo</span>
						</div>

						<div className="p-2 w-full h-full bg-gray-950 rounded-md relative">
							<video className="w-full h-full"></video>
							<span className="absolute bottom-2">Fulano 01</span>
						</div>
					</div>
				</div>

				<Chat roomId={params.id} />
			</div>

			<Footer />
		</main>
	);
}
