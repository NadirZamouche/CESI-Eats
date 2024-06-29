import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

ProductEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
  id: PropTypes.string,
};

const Transition = forwardRef((props, ref) =>
  <Slide direction="up" ref={ref} {...props} />
);

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  code: Yup.string().required('Code is required'),
});

export default function ProductEdit({ open, handleClose, handleMessage, handleMessageShow, id }) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseEdit = () => {
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

        const componentResponse = await axios.put(`${process.env.REACT_APP_IP_ADDRESS}/components/${id}`, componentData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        });

        if (componentResponse.data.error) {
          throw new Error(componentResponse.data.error);
        }

        formik.resetForm();
        handleMessage({ message: "Component updated successfully", getEditedProduct: componentResponse.data });
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

  useEffect(() => {
    if (open && id) {
      axios.get(`${process.env.REACT_APP_IP_ADDRESS}/components/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          apikey: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        formik.setValues({
          name: response.data.name,
          code: response.data.code,
        });
      })
      .catch((error) => {
        console.error("Error fetching component data:", error);
        setErrorMessage(error.message);
        handleMessage(error.message);
        handleMessageShow(true);
      });
    }
  }, [id, open, handleMessage, handleMessageShow]);

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
          <IconButton edge="start" color="inherit" onClick={handleCloseEdit} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Component
          </Typography>
          <Button autoFocus sx={{ mr: 2 }} variant='contained' color="inherit" onClick={handleCloseEdit}>
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
