import React, { createContext, useMemo, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token or fetch user data here
      // For now, we'll create a basic user object
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const contextValue = useMemo(() => ({ user, setUser, clearUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;


