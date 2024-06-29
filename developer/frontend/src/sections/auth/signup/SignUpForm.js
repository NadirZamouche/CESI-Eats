import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// @mui
import { Stack, IconButton, InputAdornment, TextField, Snackbar, Alert, Collapse } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';
import { AuthContext } from "../../../helpers/AuthContext";

// ----------------------------------------------------------------------

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      phone: Yup.number().required('Phone number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      axios.post(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/signup`, values, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          role: process.env.REACT_APP_ROLE
        }
      }).then((response) => {
        if (response.data.error) {
          setSnackbarContent(response.data.error);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          setSnackbarContent(response.data.message);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          navigate("/login");
        }
      }).catch((error) => {
        console.log(error);
        setSnackbarContent('An error occurred. Please try again.');
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    }
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3} sx={{ mb: 3 }}>
          <TextField
            name="first_name"
            label="First Name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={formik.touched.first_name && formik.errors.first_name}
          />

          <TextField
            name="last_name"
            label="Last Name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />

          <TextField
            name="phone"
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            name="email"
            label="Email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Sign Up
        </LoadingButton>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarContent}
        </Alert>
      </Snackbar>
    </>
  );
}
