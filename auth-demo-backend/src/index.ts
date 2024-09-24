import { Hono } from 'hono'
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js"
import { cors } from 'hono/cors'
import getAuthConfig from './lib/auth'

const app = new Hono<{Bindings: {
  CLIENT_URL:string,
  DB: D1Database;
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

// Auth handler setup
app.use("*", initAuthConfig(getAuthConfig))
app.use("/api/auth/*", authHandler())

// api routes
app.use('/api/*', verifyAuth())

app.get('/api/protected', (c) => {
  const auth = c.get("authUser")
  return c.json(auth)
})

app.get('/', (c) => {
  return c.redirect(c.env.CLIENT_URL)
})



export default app