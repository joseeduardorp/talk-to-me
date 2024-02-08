'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Chat from '@/components/Chat';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

import { SocketContext } from '@/contexts/SocketContext';

interface IAnswer {
	sender: string;
	description: RTCSessionDescription;
}

interface ICandidates {
	candidate: RTCIceCandidate;
	sender: string;
}

interface IDataStream {
	id: string;
	stream: MediaStream;
}

export default function Room({ params }: { params: { id: string } }) {
	const { socket } = useContext(SocketContext);
	const router = useRouter();

	const localStream = useRef<HTMLVideoElement>(null);
	const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

	const [remoteStreams, setRemoteStreams] = useState<IDataStream[]>([]);
	const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(
		null
	);

	useEffect(() => {
		socket?.on('connect', async () => {
			console.log('Conectado');

			socket.emit('subscribe', {
				roomId: params.id,
				socket: socket.id,
			});

			await initLocalCamera();
		});

		socket?.on('new user', (data) => {
			console.log('Novo usuário tentando se conectar', data);
			createPeerConnection(data.socketId, false);

			socket.emit('newUserStart', {
				to: data.socketId,
				sender: socket.id,
			});
		});

		socket?.on('newUserStart', (data) => {
			console.log('Usuário conectado na sala', data);
			createPeerConnection(data.sender, true);
		});

		socket?.on('sdp', handleAnswer);

		socket?.on('ice candidates', handleIceCandidates);
	}, [params.id, socket]);

	const handleIceCandidates = async (data: ICandidates) => {
		const peerConnection = peerConnections.current[data.sender];

		if (data.candidate) {
			await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
		}
	};

	const handleAnswer = async (data: IAnswer) => {
		const peerConnection = peerConnections.current[data.sender];

		if (data.description.type === 'offer') {
			await peerConnection.setRemoteDescription(data.description);

			const answer = await peerConnection.createAnswer();
			await peerConnection.setLocalDescription(answer);

			console.log('criando uma resposta');

			socket?.emit('sdp', {
				to: data.sender,
				sender: socket.id,
				description: peerConnection.localDescription,
			});
		} else if (data.description.type === 'answer') {
			console.log('ouvindo a oferta');

			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(data.description)
			);
		}
	};

	const createPeerConnection = async (
		socketId: string,
		createOffer: boolean
	) => {
		const config = {
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302',
				},
			],
		};

		const peer = new RTCPeerConnection(config);
		peerConnections.current[socketId] = peer;
		const peerConnection = peerConnections.current[socketId];

		if (videoMediaStream) {
			videoMediaStream.getTracks().forEach((track) => {
				peerConnection.addTrack(track, videoMediaStream);
			});
		} else {
			const video = await initRemoteCamera();
			video.getTracks().forEach((track) => {
				peerConnection.addTrack(track, video);
			});
		}

		if (createOffer) {
			const peerConnection = peerConnections.current[socketId];

			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);

			console.log('criando uma oferta');

			socket?.emit('sdp', {
				to: socketId,
				sender: socket.id,
				description: peerConnection.localDescription,
			});
		}

		peerConnection.ontrack = (event) => {
			const remoteStream = event.streams[0];

			const dataStream: IDataStream = {
				id: socketId,
				stream: remoteStream,
			};

			setRemoteStreams((prev) => {
				if (!prev.some((stream) => stream.id === socketId)) {
					return [...prev, dataStream];
				}
				return prev;
			});
		};

		peer.onicecandidate = (event) => {
			if (event.candidate) {
				socket?.emit('ice candidates', {
					to: socketId,
					sender: socket.id,
					candidate: event.candidate,
				});
			}
		};

		peer.onsignalingstatechange = (event) => {
			switch (peerConnection.signalingState) {
				case 'closed':
					setRemoteStreams((prev) =>
						prev.filter((stream) => stream.id !== socketId)
					);
					break;
			}
		};

		peer.onconnectionstatechange = (event) => {
			switch (peerConnection.connectionState) {
				case 'disconnected':
					setRemoteStreams((prev) =>
						prev.filter((stream) => stream.id !== socketId)
					);
					break;
				case 'failed':
					setRemoteStreams((prev) =>
						prev.filter((stream) => stream.id !== socketId)
					);
					break;
				case 'closed':
					setRemoteStreams((prev) =>
						prev.filter((stream) => stream.id !== socketId)
					);
					break;
			}
		};
	};

	const initLocalCamera = async () => {
		const video = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: {
				noiseSuppression: true,
				echoCancellation: true,
			},
		});

		setVideoMediaStream(video);

		if (localStream.current) {
			localStream.current.srcObject = video;
		}
	};

	const initRemoteCamera = async () => {
		const video = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: {
				noiseSuppression: true,
				echoCancellation: true,
			},
		});

		return video;
	};

	const logout = () => {
		videoMediaStream?.getTracks().forEach((track) => {
			track.stop();
		});

		Object.values(peerConnections.current).forEach((peerConnection) => {
			peerConnection.close();
		});

		socket?.disconnect();

		router.push('/');
	};

	return (
		<main className="h-screen flex flex-col">
			<Header />

			<div className="h-full overflow-y-auto flex relative">
				<div className="p-5 w-full h-full grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-5">
					<div className="p-2 w-full h-full bg-gray-950 rounded-md relative">
						<video
							className="w-full h-full mirror-mode"
							autoPlay
							playsInline
							ref={localStream}
						/>
						<span className="absolute left-4 bottom-4">José Eduardo</span>
					</div>

					{remoteStreams.map((stream, index) => (
						<div
							key={index}
							className="p-2 w-full h-full bg-gray-950 rounded-md relative"
						>
							<video
								className="w-full h-full"
								autoPlay
								playsInline
								ref={(video) => {
									if (video && video.srcObject !== stream.stream)
										video.srcObject = stream.stream;
								}}
							/>
							<span className="absolute left-4 bottom-4">José Eduardo</span>
						</div>
					))}
				</div>

				<Chat roomId={params.id} />
			</div>

			<Footer
				videoMediaStream={videoMediaStream}
				peerConnections={peerConnections.current}
				localStream={localStream.current}
				logout={logout}
			/>
		</main>
	);
}
