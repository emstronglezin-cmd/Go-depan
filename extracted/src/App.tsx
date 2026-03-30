import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Pages
import { Welcome } from '@/pages/Welcome';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

// Client Pages
import { ClientHome } from '@/pages/client/ClientHome';
import { SearchDepanneurs } from '@/pages/client/SearchDepanneurs';
import { DepanneurProfile } from '@/pages/client/DepanneurProfile';
import { ClientHistory } from '@/pages/client/ClientHistory';
import { ClientProfile } from '@/pages/client/ClientProfile';
import { RequestDetail } from '@/pages/client/RequestDetail';

// Chat
import { Chat } from '@/pages/Chat';

// Depanneur Pages
import { DepanneurHome } from '@/pages/depanneur/DepanneurHome';
import { DepanneurRequests } from '@/pages/depanneur/DepanneurRequests';
import { DepanneurEarnings } from '@/pages/depanneur/DepanneurEarnings';
import { DepanneurProfile as DepanneurProfilePage } from '@/pages/depanneur/DepanneurProfile';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

// Layouts
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { DepanneurLayout } from '@/components/layouts/DepanneurLayout';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client Routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientHome />} />
            <Route path="search" element={<SearchDepanneurs />} />
            <Route path="search/:service" element={<SearchDepanneurs />} />
            <Route path="depanneur/:id" element={<DepanneurProfile />} />
            <Route path="history" element={<ClientHistory />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="request/:id" element={<RequestDetail />} />
            <Route path="chat/:requestId" element={<Chat />} />
            <Route path="notifications" element={<ClientHistory />} />
            <Route path="*" element={<Navigate to="/client" replace />} />
          </Route>

          {/* Depanneur Routes */}
          <Route
            path="/depanneur"
            element={
              <ProtectedRoute allowedRoles={['depanneur']}>
                <DepanneurLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DepanneurHome />} />
            <Route path="requests" element={<DepanneurRequests />} />
            <Route path="earnings" element={<DepanneurEarnings />} />
            <Route path="profile" element={<DepanneurProfilePage />} />
            <Route path="request/:id" element={<DepanneurRequests />} />
            <Route path="chat/:requestId" element={<Chat />} />
            <Route path="notifications" element={<DepanneurRequests />} />
            <Route path="*" element={<Navigate to="/depanneur" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
