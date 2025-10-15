import React, { createContext, useMemo, useState } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearUser = () => setUser(null);

  const contextValue = useMemo(() => ({ user, setUser, clearUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;


