import './App.css'
import { AppRoutes } from './routes/routes'
import { AuthGoogleProvider } from "./contexts/authGoogle";
function App() {

  return (
    <>
      <AuthGoogleProvider>
        <AppRoutes/>
      </AuthGoogleProvider>
    </>
  )
}

export default App
