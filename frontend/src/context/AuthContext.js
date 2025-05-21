import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents route flashing

  // Restore token and role on app load
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
        try {
          await fetchUser(storedToken);
        } catch (err) {
          console.error('Failed to auto-fetch user:', err.message);
        }
      }

      setLoading(false); // ✅ Always turn off loading
    };

    init();
  }, []);

  const login = async (jwtToken, userRole) => {
    setToken(jwtToken);
    setRole(userRole);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userRole);

    try {
      await fetchUser(jwtToken);
    } catch (err) {
      console.error('User fetch failed during login:', err.message);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const fetchUser = async (authToken) => {
    const res = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
