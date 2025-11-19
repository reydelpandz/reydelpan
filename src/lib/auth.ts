import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { Role } from "@/generated/prisma";

// How to use : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { enabled: true },
    user: { additionalFields: { role: { type: "string", input: false } } },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user & { role: Role };
