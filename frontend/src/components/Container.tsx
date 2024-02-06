import { ReactNode } from 'react';

export default function Container({ children }: { children: ReactNode }) {
	return <div className="mx-auto p-4 max-w-7xl">{children}</div>;
}
