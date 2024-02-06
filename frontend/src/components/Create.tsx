'use client';
import { FormEvent, useRef } from 'react';

import Button from './Button';
import { Input } from './Input';

export function Create() {
	const name = useRef<HTMLInputElement>(null);

	function handleCreateRoom(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (name.current && name.current.value !== '') {
			sessionStorage.setItem('username', name.current.value);

			const roomId = generateRandomString();
			window.location.href = `/room/${roomId}`;
		}
	}

	function generateRandomString() {
		const randomString = Math.random().toString(36).substring(2, 7);
		return randomString;
	}

	return (
		<form onSubmit={handleCreateRoom} className="space-y-6">
			<Input type="text" placeholder="Seu nome" ref={name} />

			<Button type="submit" title="Criar" />
		</form>
	);
}
