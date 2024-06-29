import { useContext, useState, useEffect } from 'react';
import { Box, Card, Paper, Typography, CardHeader, CardContent, Container, TextField, Grid, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function ProfilePage() {
    const { authState, setAuthState } = useContext(AuthContext); // Added setAuthState to update auth state
    const userInfo = authState.userInfo;
    const [userSQL, setUserSQL] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/check`, { headers: { accessToken: localStorage.getItem("accessToken"), apikey: process.env.REACT_APP_API_KEY, role: process.env.REACT_APP_ROLE } }).then((response) => {
            if (response.data.error) {
                setUserSQL({});
            } else {
                console.log({
                    id: response.data.user.id,
                    first_name: response.data.user.first_name,
                    last_name: response.data.user.last_name,
                    phone: response.data.user.phone,
                    email: response.data.user.email,
                    role: response.data.user.role
                  })
                setUserSQL({
                  id: response.data.user.id,
                  first_name: response.data.user.first_name,
                  last_name: response.data.user.last_name,
                  phone: response.data.user.phone,
                  email: response.data.user.email,
                  role: response.data.user.role
                });
            }
          }).catch((error) => {
            console.error("Error fetching authentication status:", error);
            // Handle the error, e.g., redirect to an error page or show a relevant message to the user.
          });
    }, []);
    

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            first_name: userSQL.first_name || '',
            last_name: userSQL.last_name || '',
            email: userSQL.email || '',
            phone: userSQL.phone || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.number().required('Phone number is required'),
        }),
        onSubmit: values => {
            
            axios.put(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/user/${userInfo.id}`, values,{
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                  apikey: process.env.REACT_APP_API_KEY,
                },
              })
              .then((response) => {
                if (response.data.error) {
                  setSnackbarContent(response.data.error);
                  setSnackbarSeverity("error");
                } else {
                  setSnackbarContent(response.data.message);
                  setSnackbarSeverity("success");
                  localStorage.removeItem("accessToken")
                  setAuthState({ // Reset the auth state
                    userInfo: null,
                    isAuthenticated: false
                  });
                  navigate("/login")
                }
                setSnackbarOpen(true);
              })
              .catch((error) => {
                console.error(error);
                setSnackbarContent('An error occurred. Please try again.');
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
              });
        }
    });

    const handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/user/${userInfo.id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                apikey: process.env.REACT_APP_API_KEY,
            },
        }).then((response) => {
            if (response.data.error) {
                setSnackbarContent(response.data.error);
                setSnackbarSeverity("error");
            } else {
                setSnackbarContent('Account deleted successfully');
                setSnackbarSeverity("success");
                localStorage.removeItem("accessToken")
                setAuthState({ // Reset the auth state
                    userInfo: null,
                    isAuthenticated: false
                  });
                navigate("/login")
            }
            setSnackbarOpen(true);
        }).catch((error) => {
            console.error(error);
            setSnackbarContent('An error occurred. Please try again.');
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Sponsorship code copied to clipboard');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Card>
                <CardHeader title="Profile" subheader="Edit your profile" />

                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                    helperText={formik.touched.first_name && formik.errors.first_name}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Save
                            </Button>
                        </Box>
                        <Box mt={2}>
                            <Button variant="contained" color="error" onClick={handleDelete} fullWidth>
                                Delete
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarContent}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ProfilePage;
