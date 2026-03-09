import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cet_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(res => setUsuario(res.data.data))
        .catch(() => { localStorage.removeItem('cet_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, usuario } = res.data.data;
    localStorage.setItem('cet_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('cet_token');
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
