'use client'
import { Button } from '@/components/ui/button'
import GoogleIcon from '@/components/GoogleIcon'
import { loginWithGoogle } from '@/auth/action'
import { useState } from 'react';

export default function GoogleAuthButton() {
	const [googleBtnLoading, setGoogleBtnLoading] = useState(false);
	const handleGoogleLogin = async () => {
		setGoogleBtnLoading(true);
		try {
			await loginWithGoogle();
		} catch (error) {
			console.error('Google login error:', error);
			setGoogleBtnLoading(false);
		}
	}
	return (
		<Button 
			variant="secondary" 
			disabled={googleBtnLoading} 
			onClick={handleGoogleLogin} 
			size="lg" 
			className="w-full"
		>
			<GoogleIcon className="mr-2 h-4 w-4" />
			{googleBtnLoading ? 'Logging in...' : 'Login with Google'}
		</Button>
	)
}