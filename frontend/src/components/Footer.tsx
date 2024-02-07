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

export default function Footer() {
	const [isMuted, setIsMuted] = useState(false);
	const [isCameraOff, setIsCameraOff] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);

	const hours = new Intl.DateTimeFormat('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date());

	return (
		<footer className="py-3 w-full bg-black">
			<Container>
				<div className="flex items-center justify-center md:grid grid-cols-3">
					<span className="hidden md:block text-xl">{hours}</span>

					<div className="flex justify-center space-x-6">
						{isMuted ? (
							<NoMic
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
								onClick={() => setIsMuted(!isMuted)}
							/>
						) : (
							<Mic
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
								onClick={() => setIsMuted(!isMuted)}
							/>
						)}

						{isCameraOff ? (
							<NoCamera
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
								onClick={() => setIsCameraOff(!isCameraOff)}
							/>
						) : (
							<Camera
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
								onClick={() => setIsCameraOff(!isCameraOff)}
							/>
						)}

						{isScreenSharing ? (
							<Monitor
								className="p-2 w-16 h-10 bg-gray-950 rounded-md text-white"
								onClick={() => setIsScreenSharing(!isScreenSharing)}
							/>
						) : (
							<NoMonitor
								className="p-2 w-16 h-10 bg-red-500 rounded-md text-white"
								onClick={() => setIsScreenSharing(!isScreenSharing)}
							/>
						)}

						<Phone className="p-2 w-16 h-10 bg-primary hover:bg-red-500 rounded-md cursor-pointer text-white" />
					</div>
				</div>
			</Container>
		</footer>
	);
}
