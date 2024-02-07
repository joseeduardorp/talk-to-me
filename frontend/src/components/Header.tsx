import Image from 'next/image';
import Container from './Container';

export default function Header() {
	return (
		<header className="p-4 bg-gray-1000">
			<Container>
				<div className="flex justify-between">
					<Image alt="Talk to Me" src="/logo.svg" width={170} height={60} />
					<Image alt="Hero" src="/hero.svg" width={60} height={60} />
				</div>
			</Container>
		</header>
	);
}
