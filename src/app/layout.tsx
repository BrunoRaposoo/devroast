import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { TRPCProviderWrapper } from "@/components/trpc-provider";

const geist = Geist({
	variable: "--font-secondary",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-primary",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
			<body>
				<TRPCProviderWrapper>
					<Navbar />
					<main className="min-h-screen bg-bg-page">
						<div className="mx-auto max-w-[1440px]">{children}</div>
					</main>
				</TRPCProviderWrapper>
			</body>
		</html>
	);
}
