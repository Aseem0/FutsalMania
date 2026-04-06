import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Grounds from './pages/Grounds';
import Matches from './pages/Matches';
import Bookings from './pages/Bookings';
import Tournaments from './pages/Tournaments';
import Layout from './components/Layout';
import ManagerList from './pages/admin/managers/ManagerList';
import CreateManager from './pages/admin/managers/CreateManager';
import CreateTournament from './pages/admin/tournaments/CreateTournament';
import EditTournament from './pages/admin/tournaments/EditTournament';
import ManagerDashboard from './pages/manager/Dashboard';
import ArenaOverview from './pages/manager/ArenaOverview';
import BookingManagement from './pages/manager/BookingManagement';
import ScheduleManagement from './pages/manager/ScheduleManagement';
import CustomerManagement from './pages/manager/CustomerManagement';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser'));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If user is logged in but doesn't have the specific role for this route
    // Redirect them to their own dashboard instead of login
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

const RoleBasedRedirect = () => {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRole="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleBasedRedirect />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="grounds" element={<Grounds />} />
        <Route path="matches" element={<Matches />} />
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="tournaments/create" element={<CreateTournament />} />
        <Route path="tournaments/edit/:id" element={<EditTournament />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="managers" element={<ManagerList />} />
        <Route path="managers/create" element={<CreateManager />} />
      </Route>

      {/* Manager Specific Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="manager">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="arena" element={<ArenaOverview />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="schedule" element={<ScheduleManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
      </Route>
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

export default App;
