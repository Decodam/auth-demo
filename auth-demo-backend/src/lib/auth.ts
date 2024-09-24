import GitHub from "@auth/core/providers/github";
import { type AuthConfig } from "@hono/auth-js";
import { Context } from "hono";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { initDbConnect } from "../db/index";


export default function getAuthConfig(c: Context): AuthConfig {
  return {
    adapter: DrizzleAdapter(initDbConnect(c.env.DB)),
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_CLIENT_ID,
        clientSecret: c.env.GITHUB_CLIENT_SECRET
      }),
    ]
  }
}
