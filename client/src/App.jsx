import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ApiDetails from "./pages/ApiDetails";
import AddApi from "./pages/AddApi";
import Notifications from "./pages/Notifications";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";
import CostTracking from "./pages/CostTracking";
import Contracts from "./pages/Contracts";
import SLATracking from "./pages/SLATracking";
import Regressions from "./pages/Regressions";
import Insights from "./pages/Insights";
import QueryInterface from "./pages/QueryInterface";
import Dependencies from "./pages/Dependencies";
import Webhooks from "./pages/Webhooks";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen flex flex-col bg-background text-foreground font-sans antialiased'>
          <Navbar />
          <main className='flex-1'>
            <Routes>
              {/* Public Routes */}
              <Route path='/' element={<LandingPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route
                path='/reset-password/:token'
                element={<ResetPassword />}
              />
              <Route path='/playground' element={<Playground />} />

              {/* Protected Routes */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/add-api'
                element={
                  <ProtectedRoute>
                    <AddApi />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/api/:id'
                element={
                  <ProtectedRoute>
                    <ApiDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/notifications'
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/costs'
                element={
                  <ProtectedRoute>
                    <CostTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/contracts'
                element={
                  <ProtectedRoute>
                    <Contracts />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/sla'
                element={
                  <ProtectedRoute>
                    <SLATracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/regressions'
                element={
                  <ProtectedRoute>
                    <Regressions />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/insights'
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/query'
                element={
                  <ProtectedRoute>
                    <QueryInterface />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/dependencies'
                element={
                  <ProtectedRoute>
                    <Dependencies />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/webhooks'
                element={
                  <ProtectedRoute>
                    <Webhooks />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/settings'
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position='bottom-right'
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
