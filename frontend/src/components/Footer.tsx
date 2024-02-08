'use client';
import { useState } from 'react';

import {
	Camera,
	Mic,
	Monitor,
	Phone,
	NoMic,
	NoCamera,
	NoMonitor,
} from '@/Icons';
import Container from './Container';

export default function Footer({
	videoMediaStream,
	peerConnections,
	localStream,
	logout,
}: {
	videoMediaStream: MediaStream | null;
	peerConnections: Record<string, RTCPeerConnection>;
	localStream: HTMLVideoElement | null;
	logout: () => void;
}) {
	const [isMuted, setIsMuted] = useState(false);
	const [isCameraOff, setIsCameraOff] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);

	const hours = new Intl.DateTimeFormat('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date());

	const toggleMuted = () => {
		setIsMuted((prev) => !prev);

		videoMediaStream?.getAudioTracks().forEach((track) => {
			track.enabled = isMuted;
		});

		Object.values(peerConnections).forEach((peerConnection) => {
			peerConnection.getSenders().forEach((sender) => {
				if (sender.track?.kind === 'audio') {
					videoMediaStream
						?.getAudioTracks()
						.find((track) => track.kind === 'audio');
				}
			});
		});
	};

	const toggleVideo = () => {
		setIsCameraOff((prev) => !prev);

		videoMediaStream?.getVideoTracks().forEach((track) => {
			track.enabled = isCameraOff;
		});

		Object.values(peerConnections).forEach((peerConnection) => {
			peerConnection.getSenders().forEach((sender) => {
				if (sender.track?.kind === 'video') {
					videoMediaStream
						?.getVideoTracks()
						.find((track) => track.kind === 'video');
				}
			});
		});
	};

	const toggleScreenSharing = async () => {
		if (!isScreenSharing) {
			const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
				video: true,
			});

			if (localStream) localStream.srcObject = videoShareScreen;

			Object.values(peerConnections).forEach((peerConnection) => {
				peerConnection.getSenders().forEach((sender) => {
					if (sender.track?.kind === 'video') {
						sender.replaceTrack(videoShareScreen.getVideoTracks()[0]);
					}
				});
			});

			setIsScreenSharing((prev) => !prev);
			return;
		}

		if (localStream) localStream.srcObject = videoMediaStream;

		Object.values(peerConnections).forEach((peerConnection) => {
			peerConnection.getSenders().forEach((sender) => {
				if (sender.track?.kind === 'video' && videoMediaStream) {
					sender.replaceTrack(videoMediaStream.getVideoTracks()[0]);
				}
			});
		});
		setIsScreenSharing((prev) => !prev);
	};

	return (
		<footer className="py-3 w-full bg-black">
			<Container>
				<div className="flex items-center justify-center md:grid grid-cols-3">
					<span className="hidden md:block text-xl">{hours}</span>

					<div className="flex justify-center space-x-6">
						{isMuted ? (
							<NoMic
								onClick={toggleMuted}
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
							/>
						) : (
							<Mic
								onClick={toggleMuted}
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
							/>
						)}

						{isCameraOff ? (
							<NoCamera
								onClick={toggleVideo}
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
							/>
						) : (
							<Camera
								onClick={toggleVideo}
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
							/>
						)}

						{isScreenSharing ? (
							<Monitor
								onClick={toggleScreenSharing}
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
							/>
						) : (
							<NoMonitor
								onClick={toggleScreenSharing}
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
							/>
						)}

						<Phone
							onClick={logout}
							className="p-2 w-16 h-10 bg-primary hover:bg-red-500 rounded-md cursor-pointer text-white"
						/>
					</div>
				</div>
			</Container>
		</footer>
	);
}
