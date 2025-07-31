import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ProgressProvider from "@/components/ProgressBar";
import './globals.css'
import NavbarContainer from "@/components/Navbar/NavbarContainer";
import { SnackbarProvider } from "@/components/SnackbarProvider";

export const metadata = {
  title: "Cashflowy Transactions App",
  description: "",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ServiceWorkerRegistration />
        <ProgressProvider>
          <SnackbarProvider>
            <NavbarContainer>
              {children}
            </NavbarContainer>
          </SnackbarProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
