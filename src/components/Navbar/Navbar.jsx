'use client';
import Logo from '../Logo';

export default function Navbar({ user, signOut }) {


	return (
		<nav className="fixed top-0 left-0 right-0 h-10 z-[1000] px-1 flex items-center justify-between border-b border-border bg-background">
			<div className="flex items-center gap-1">
				<Logo offering='Transactions' />
			</div>
		</nav>
	);
};

