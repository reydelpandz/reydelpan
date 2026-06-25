import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { Role } from "@/generated/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { enabled: true },
    user: {
        // deleteUser: {
        //     enabled: true,
        // },
        additionalFields: { role: { type: "string", input: false } },
    },
    trustedOrigins: ["https://rey-del-pan.com"],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user & { role: Role };
