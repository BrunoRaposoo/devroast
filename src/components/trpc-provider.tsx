"use client";

import { TRPCReactProvider } from "@/client/trpc/client";

export function TRPCProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
