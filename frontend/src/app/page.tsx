import { FormWrapper } from '@/components/FormWrapper';
import Header from '@/components/Header';

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="mx-auto w-full max-w-[580px] h-full flex-1 flex items-center justify-center">
				<FormWrapper />
			</div>
		</main>
	);
}
