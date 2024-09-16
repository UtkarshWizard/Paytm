import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import zod from "zod";

interface Credentials {
  phone: string;
  password: string;
}

const schema = zod.object({
  phone: zod.string(),
  password: zod.string(),
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone Number",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) return null;

        // Do zod validation, OTP validation here
        const response = schema.safeParse(credentials);

        if (response) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const existingUser = await db.user.findFirst({
            where: {
              number: credentials.phone,
            },
          });

          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.number,
              };
            }
            return null;
          }

          try {
            const user = await db.user.create({
              data: {
                number: credentials.phone,
                password: hashedPassword,
              },
            });

            return {
              id: user.id.toString(),
              name: user.name,
              email: user.number,
            };
          } catch (e) {
            console.error(e);
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
