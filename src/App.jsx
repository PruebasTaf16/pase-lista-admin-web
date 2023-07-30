import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom"

import Home from "./pages/private/Home"
import Login from "./pages/Login"
import Recuperar from "./pages/Recuperar"
import Registrar from "./pages/Registrar"
import Roles from "./pages/private/Roles"
import Graficas from "./pages/private/Graficas"

import { AuthProvider } from "./contexts/auth-context"
import AppLayout from "./layouts/AppLayout"
import PublicLayout from "./layouts/PublicLayout"
import Trabajadores from "./pages/private/Trabajadores"
import ActualizarPassword from "./pages/ActualizarPassword"
import Justificantes from "./pages/private/Justificantes"
import ActualizarPasswordTrabajador from "./pages/ActualizarPasswordTrabajador"

/**Manejar todas las rutas públicas y privadas */
function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index path="/iniciar-sesion" Component={Login}/>
            <Route path="/registrar" Component={Registrar}/>
            <Route path="/recuperar" Component={Recuperar}/>
            <Route path="/actualizar-password/:token" Component={ActualizarPassword}/>
            <Route path="/recuperar-cuenta-trabajador/:token" Component={ActualizarPasswordTrabajador}/>
          </Route>

          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />}/>
            <Route path="/trabajadores" element={<Trabajadores />}/>
            <Route path="/roles" element={<Roles />}/>
            <Route path="/graficas" element={<Graficas />}/>
            <Route path="/justificantes" element={<Justificantes />}/>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
