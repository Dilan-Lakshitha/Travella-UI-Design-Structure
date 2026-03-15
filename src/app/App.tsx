import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from './components/ui/sonner';

// Pages
import Login from './pages/Login';
import GuestDashboard from './pages/GuestDashboard';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryManagement from './pages/ItineraryManagement';
import AgencyReview from './pages/AgencyReview';
import PricingAssignment from './pages/PricingAssignment';
import StaffManagement from './pages/StaffManagement';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'guest' | 'agency' | 'admin'>('guest');

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route 
          path="/login" 
          element={
            <Login 
              onLogin={(role) => {
                setIsAuthenticated(true);
                setUserRole(role);
              }} 
            />
          } 
        />
        
        {/* Guest Routes */}
        <Route 
          path="/guest/dashboard" 
          element={isAuthenticated ? <GuestDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/guest/itinerary-builder" 
          element={isAuthenticated ? <ItineraryBuilder /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/guest/booking/:id" 
          element={isAuthenticated ? <BookingConfirmation /> : <Navigate to="/login" />} 
        />
        
        {/* Agency/Expert Routes */}
        <Route 
          path="/agency/review" 
          element={isAuthenticated ? <AgencyReview /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/agency/pricing/:id" 
          element={isAuthenticated ? <PricingAssignment /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/agency/staff" 
          element={isAuthenticated ? <StaffManagement /> : <Navigate to="/login" />} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/itineraries" 
          element={isAuthenticated ? <ItineraryManagement /> : <Navigate to="/login" />} 
        />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
