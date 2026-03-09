import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import HistorialPaciente from './pages/HistorialPaciente';
import Medicamentos from './pages/Medicamentos';
import Consultas from './pages/Consultas';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { usuario, loading } = useAuth();
  if (loading) return (
    <div className="loading-center" style={{ minHeight: '100vh' }}>
      <div className="spinner spinner-dark" style={{ width: 40, height: 40 }}></div>
    </div>
  );
  return usuario ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { usuario, loading } = useAuth();
  if (loading) return null;
  return usuario ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }
        }} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="pacientes/:id/historial" element={<HistorialPaciente />} />
            <Route path="medicamentos" element={<Medicamentos />} />
            <Route path="consultas" element={<Consultas />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
