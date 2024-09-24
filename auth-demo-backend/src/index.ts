import { Hono, Context } from 'hono'
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js"
import GitHub from "@auth/core/providers/github"
import { cors } from 'hono/cors'
import { Bindings } from 'hono/types'

const app = new Hono<{Bindings: {
  CLIENT_URL:string
}}>()

app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type", "x-auth-return-redirect", 'X-CSRF-Token'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH'],
    credentials: true,
  })
)

app.use("*", initAuthConfig(getAuthConfig))

app.use("/api/auth/*", authHandler())

app.use('/api/*', verifyAuth())

app.get('/api/protected', (c) => {
  const auth = c.get("authUser")
  return c.json(auth)
})

app.get('/', (c) => {
  return c.redirect(c.env.CLIENT_URL)
})

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_CLIENT_ID,
        clientSecret: c.env.GITHUB_CLIENT_SECRET
      }),
    ]
  }
}

export default app