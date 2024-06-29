import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import { Stack, IconButton, InputAdornment, TextField, Alert, Collapse } from '@mui/material';
import { Cancel } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { AuthContext } from "../../../helpers/AuthContext";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const login = (e) => {
    if (e) {
      e.preventDefault();
    }
    axios.post(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/login`, { email, password }, {
      headers: {
        apikey: process.env.REACT_APP_API_KEY,
        role: process.env.REACT_APP_ROLE
      }
    }).then((response) => {
      if (response.data.error) {
        setServerError(response.data.error);
      } else {
        setServerError("");
        localStorage.setItem("accessToken", response.data.accessToken);
        setAuthState({
          isAuthenticated: true,
          userInfo: {
            id: response.data.userInfo.id,
            first_name: response.data.userInfo.first_name,
            last_name: response.data.userInfo.last_name,
            phone: response.data.userInfo.phone,
            email: response.data.userInfo.email,
            role: response.data.userInfo.role
          }
        });
        navigate("/dashboard/components");
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <Stack spacing={3} sx={{ mb: 3 }}>
        <TextField 
          name="email" 
          label="Email address" 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Collapse in={serverError !== ""}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setServerError("")
                }}
              >
                <Cancel fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
            severity="error"
          >
            {serverError}
          </Alert>
        </Collapse>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={login}>
        Login
      </LoadingButton>
    </>
  );
}
