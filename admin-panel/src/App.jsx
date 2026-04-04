import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Grounds from './pages/Grounds';
import Matches from './pages/Matches';
import Bookings from './pages/Bookings';
import Layout from './components/Layout';
import ManagerList from './pages/admin/managers/ManagerList';
import CreateManager from './pages/admin/managers/CreateManager';
import ManagerDashboard from './pages/manager/Dashboard';

const ProtectedRoute = ({ children, allowedRole = 'admin' }) => {
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser'));

  if (!token || !user || (allowedRole === 'admin' && user.role !== 'admin') || (allowedRole === 'manager' && user.role !== 'manager')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="grounds" element={<Grounds />} />
        <Route path="matches" element={<Matches />} />
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
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
