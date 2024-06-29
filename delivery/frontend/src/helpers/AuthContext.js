import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,  // True if user is logged in
        userInfo: {
            id: 0,
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            role: ""
          }
    });

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};