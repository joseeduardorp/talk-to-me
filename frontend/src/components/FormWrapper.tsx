'use client';
import { useState } from 'react';
import Container from './Container';
import { Join } from './Join';
import { Create } from './Create';

export function FormWrapper() {
	const [selectedRoom, setSelectedRoom] = useState<'join' | 'create'>('join');

	const handleSelectRoom = (room: 'join' | 'create') => {
		setSelectedRoom(room);
	};

	return (
		<div className="m-10 mt-40 w-full max-w-[580px] h-full">
			<div className="flex items-center text-center">
				<span
					onClick={() => handleSelectRoom('join')}
					className={`p-4 w-1/2 cursor-pointer ${
						selectedRoom === 'join' && 'bg-secondary rounded-t-lg text-primary'
					}`}
				>
					Ingressar
				</span>

				<span
					onClick={() => handleSelectRoom('create')}
					className={`p-4 w-1/2 cursor-pointer ${
						selectedRoom === 'create' &&
						'bg-secondary rounded-t-lg text-primary'
					}`}
				>
					Nova reunião
				</span>
			</div>

			<div className="p-10 w-full bg-secondary rounded-b-lg">
				<RoomSelector selectedRoom={selectedRoom} />
			</div>
		</div>
	);
}

const RoomSelector = ({
	selectedRoom,
}: {
	selectedRoom: 'join' | 'create';
}) => {
	switch (selectedRoom) {
		case 'join':
			return <Join />;
		case 'create':
			return <Create />;
		default:
			return <Join />;
	}
};
