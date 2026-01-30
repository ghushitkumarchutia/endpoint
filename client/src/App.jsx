import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import useAuth from "./hooks/useAuth";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Monitors from "./pages/Monitors";
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

// Robust Layout to handle Fixed Sidebar + Content
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* 
         Outer container: Strictly h-screen and overflow-hidden to prevent window scroll. 
         bg-white to show through gaps (floating effect).
      */}
      {/* 
         Outer container: 
         - Mobile: min-h-screen (grows with content), window scrolls.
         - Desktop (lg): h-screen overflow-hidden (app-like fixed layout).
      */}
      <div className='w-screen bg-white min-h-screen lg:h-screen lg:overflow-hidden'>
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 
           Content Wrapper 
           - Uses 'md:pl-64' padding-left to clear standard sidebar space.
           - Flex column to stack Navbar and Main content.
           - h-full to fill the screen on desktop.
        */}
        <div
          className={`flex flex-col ${showSidebar ? "md:pl-64" : ""} h-full`}
        >
          {/* Navbar stuck nicely inside the content area */}
          {showSidebar && <Navbar onMenuClick={() => setIsSidebarOpen(true)} />}

          {/* 
             Main Content Area
             - Desktop: flex-1 overflow-hidden (internal scroll if needed).
             - Mobile: overflow-visible (let page scroll).
          */}
          <main className='flex-1 p-4 pt-4 overflow-visible lg:overflow-hidden'>
            {children}
          </main>
        </div>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen flex flex-col font-sans antialiased'>
      {/* Public Navbar Handling */}
      {!isAuthenticated && (
        <div className='sticky top-0 z-50 bg-white border-b border-gray-100'>
          <Navbar />
        </div>
      )}

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
            path='/monitors'
            element={
              <ProtectedRoute>
                <Monitors />
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
