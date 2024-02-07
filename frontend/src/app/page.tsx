import { FormWrapper } from '@/components/FormWrapper';
import Header from '@/components/Header';

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="flex-1 flex justify-center">
				<FormWrapper />
			</div>
		</main>
	);
}
