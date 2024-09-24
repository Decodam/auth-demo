import './App.css'
import { authConfigManager, SessionProvider, signIn, signOut, useSession } from "@hono/auth-js/react"


authConfigManager.setConfig({
  baseUrl: 'https://auth-demo-backend.arghyamondal-work.workers.dev', //'http://localhost:8787',
  credentials:'include' //needed  for cross domain setup
});

function App() {

  return (
    <SessionProvider>
      <Page />
    </SessionProvider>
  )
}


function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>

  if(status === "authenticated") {
    return (
      <div >
        <img style={{width: 80, height: 80, borderRadius: 20}} src={session.user?.image || ""} alt="avatar" />
        <p>I am {session?.user?.name}</p>
        <button
          onClick={() => {signOut()}}
        >
          Sign Out
        </button>
      </div>
    )
  }

  else {
    return(
      <div>
        <button onClick={() => {signIn("github")}}>
          Signin with github
        </button>
      </div>
    )
  }
}

export default App
