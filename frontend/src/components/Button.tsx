interface IButton {
	title: string;
	type: 'button' | 'submit' | 'reset';
}

export default function Button({ title, type }: IButton) {
	return (
		<button
			type={type}
			className="py-2 w-full bg-primary rounded-md text-black font-medium"
		>
			<span>{title}</span>
		</button>
	);
}
