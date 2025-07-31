import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Typography } from '@/components/ui/typography';
import Logo from '@/components/Logo';
import GoogleAuthButton from "./GoogleAuthButton";

export default function Login({ searchParams }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8">
          {searchParams?.message && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center">
              <Logo className="scale-150" />
            </div>

            <div className="text-center space-y-2">
              <Typography variant="h3" className="font-bold">
                Welcome to Cashflowy
              </Typography>
              <Typography variant="muted" className="text-muted-foreground">
                Sign in to continue to your account
              </Typography>
            </div>

            <div className="w-full">
              <GoogleAuthButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}