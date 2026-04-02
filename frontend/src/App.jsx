import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from './services/authService';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/notFound';

// Guard: redirect to /login if not authenticated
const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" />;

// Guard: redirect non-admins to /dashboard
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  const user = getCurrentUser();
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

// FIX #6: Removed pointless checking/useEffect pattern — isAuthenticated() is a
// synchronous localStorage read, no async work needed. The spinner caused a
// flash on every page load for zero benefit.
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
