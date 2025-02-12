import Login from "./Pages/Login"
import ForgotPassword from "./Pages/ForgotPassword"
import ResetPassword from "./Pages/ResetPassword"
import AdminDashboard from "./Pages/AdminDashboard"
import CustomerDashboard from "./Pages/CustomerDashboard"
import { AlertProvider } from "./Components/AlertContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = !!localStorage.getItem("user")
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  )
}


function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin-dashboard" element={<PrivateRoute component={AdminDashboard} />} />
            <Route path="/customer-dashboard" element={<PrivateRoute component={CustomerDashboard} />} />
          </Routes>
        </div>
      </AlertProvider>
    </BrowserRouter>
  )
}




export default App

