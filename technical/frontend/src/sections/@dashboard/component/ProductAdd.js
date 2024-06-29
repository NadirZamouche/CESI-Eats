import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  styled,
  DialogContent,
  TextField,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Box,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, forwardRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

ProductAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
};

const Transition = forwardRef((props, ref) =>
  <Slide direction="up" ref={ref} {...props} />
);

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  code: Yup.string().required('Code is required'),
});

export default function ProductAdd({ open, handleClose, handleMessage, handleMessageShow }) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseAdd = () => {
    handleClose();
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const componentData = {
          name: values.name,
          code: values.code,
        };

        const componentResponse = await axios.post(`${process.env.REACT_APP_IP_ADDRESS}/components`, componentData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        });

        if (componentResponse.data.error) {
          throw new Error(componentResponse.data.error);
        }

        formik.resetForm();
        handleMessage(componentResponse.data);
        handleMessageShow(true);
        handleClose();

      } catch (error) {
        setErrorMessage(error.message);
        handleMessage(error.message);
        handleMessageShow(true);
        handleClose();
      }
    }
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar color="inherit" sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseAdd} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add a Component
          </Typography>
          <Button autoFocus sx={{ mr: 2 }} variant='contained' color="inherit" onClick={handleCloseAdd}>
            Cancel
          </Button>
          <Button type="submit" autoFocus variant='contained' color="primary" onClick={formik.handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 5 }}>
        <Container>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <CodeMirror
                  value={formik.values.code}
                  height="600px"
                  theme={okaidia}
                  extensions={[javascript({ jsx: true })]}
                  onChange={(value) => formik.setFieldValue('code', value)}
                />
                {formik.touched.code && formik.errors.code && (
                  <Typography variant="caption" color="error">
                    {formik.errors.code}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
