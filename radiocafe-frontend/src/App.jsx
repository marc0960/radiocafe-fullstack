import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Home from './pages/Home';
import ClientCatalog from './pages/ClientCatalog';
import AdminDashboard from './pages/AdminDashboard';
import BartenderDashboard from './pages/BartenderDashboard';
import { OrderProvider } from './context/OrderContext';


function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/catalogo" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/catalogo" 
                element={
                  <ProtectedRoute>
                    <ClientCatalog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/bartender" element={<ProtectedRoute requiredRole="BARTENDER"><BartenderDashboard /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}