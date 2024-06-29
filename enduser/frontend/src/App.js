import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { AuthContext } from "./helpers/AuthContext";
import { CartProvider } from './helpers/CartContext';

// ----------------------------------------------------------------------

export default function App() {
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/check`, { headers: { accessToken: localStorage.getItem("accessToken"), apikey: process.env.REACT_APP_API_KEY, role: process.env.REACT_APP_ROLE } }).then((response) => {
      if (response.data.error) {
        setAuthState({ 
          isAuthenticated: false,
          userInfo: {
            id: 0,
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            role: ""
          }
          });
      } else {
        setAuthState({ isAuthenticated: true, 
          userInfo: {
            id: response.data.user.id,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            phone: response.data.user.phone,
            email: response.data.user.email,
            role: response.data.user.role
          }  
        });
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching authentication status:", error);
      // Handle the error, e.g., redirect to an error page or show a relevant message to the user.
      setLoading(false);
    });
}, []);
  return (
    <CartProvider>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              {!loading && (  
                <Router />
              )}
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </AuthContext.Provider>
    </CartProvider>
    
  );
}
