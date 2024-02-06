'use client';
import { FormEvent, useRef } from 'react';
import Button from './Button';
import { Input } from './Input';

export function Join() {
	const name = useRef<HTMLInputElement>(null);
	const id = useRef<HTMLInputElement>(null);

	function handleJoinRoom(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (
			name.current &&
			id.current &&
			name.current.value !== '' &&
			id.current.value !== ''
		) {
			sessionStorage.setItem('username', name.current.value);

			const roomId = id.current.value;
			window.location.href = `/room/${roomId}`;
		}
	}

	return (
		<form onSubmit={handleJoinRoom} className="space-y-6">
			<Input type="text" placeholder="Seu nome" ref={name} />
			<Input type="text" placeholder="ID da reunião" ref={id} />

			<Button type="submit" title="Entrar" />
		</form>
	);
}
