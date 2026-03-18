import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
	return {
		db: null,
	};
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
