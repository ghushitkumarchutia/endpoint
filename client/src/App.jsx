import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
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
import useAuth from "./hooks/useAuth";

// Layout wrapper that conditionally shows sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Public routes (no sidebar)
  const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
  const isResetPassword = location.pathname.startsWith("/reset-password");
  const isPublicRoute =
    publicRoutes.includes(location.pathname) || isResetPassword;

  // Show sidebar only for authenticated users on protected routes
  const showSidebar = isAuthenticated && !isPublicRoute;

  // Show footer only on landing page
  const showFooter = location.pathname === "/";

  return (
    <>
      <div className='flex-1 flex'>
        {showSidebar && <Sidebar />}
        <div className={`flex-1 ${showSidebar ? " overflow-auto" : ""}`}>
          {children}
        </div>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

function AppContent() {
  return (
    <div className='min-h-screen flex flex-col bg-black text-white font-sans antialiased'>
      <Navbar />
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
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
      </AppLayout>
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
