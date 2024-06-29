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
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { LoadingButton } from '@mui/lab';

MenuAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
};

const Transition = forwardRef((props, ref) =>
  <Slide direction="up" ref={ref} {...props} />
);

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  articles: Yup.array().required('At least one article is required'),
});

export default function MenuAdd({ open, handleClose, handleMessage, handleMessageShow }) {
  const [articles, setArticles] = useState([]);
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [fileExtensionName, setFileExtensionName] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/articles`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setArticles(response.data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  const handleCloseAdd = () => {
    handleClose();
    formik.resetForm();
    setCroppingImage(null);
    setCroppingImageUrl(null);
    setCroppedImageUrl(null);
  };

  const handleFileUpload = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'svg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        setOpenSnackbar(true);
        setErrorMessage("Invalid file type");
        return;
      }

      setFileExtensionName(fileExtension);
      setCroppingImage(file);
      setCroppingImageUrl(URL.createObjectURL(file));
      setCroppedImageUrl(null);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      setUploading(true);
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedUrl = URL.createObjectURL(blob);
        setCroppedImageUrl(croppedUrl);
        setCroppingImage(blob);
        setCroppingImageUrl(null); // Hide the Cropper component
        setUploading(false);
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      articles: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let imageUrl = '';

        if (croppingImage) {
          const formData = new FormData();
          formData.append('image', croppingImage, `image.${fileExtensionName}`);

          console.log("Uploading image to image service...");
          const imageUploadResponse = await axios.post('http://localhost:5010/api/uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log("Image upload response:", imageUploadResponse.data);
          if (imageUploadResponse.data.error) {
            throw new Error(imageUploadResponse.data.error);
          }

          imageUrl = imageUploadResponse.data.path;
        }
console.log(imageUrl)
console.log(values.articles)

        const menuData = {
          name: values.name,
          price: values.price,
          Article: values.articles,
          path: imageUrl,
        };

        console.log("Creating menu with data:", menuData);
        const menuResponse = await axios.post(`${process.env.REACT_APP_IP_ADDRESS}/menus`, menuData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        });

        console.log("Menu response:", menuResponse.data);
        if (menuResponse.data.error) {
          throw new Error(menuResponse.data.error);
        }

        formik.resetForm();
        setCroppingImage(null);
        setCroppedImageUrl(null);
        handleMessage(menuResponse.data);
        handleMessageShow(true);
        handleClose();

      } catch (error) {
        console.error("Error submitting form:", error);
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
            Add a Menu
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={articles}
                  getOptionLabel={(option) => option.name}
                  filterSelectedOptions
                  onChange={(event, value) => formik.setFieldValue('articles', value.map((item) => item._id))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Articles"
                      placeholder="Select articles"
                      error={formik.touched.articles && Boolean(formik.errors.articles)}
                      helperText={formik.touched.articles && formik.errors.articles}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                    ))
                  }
                />
              </Grid>
              {!croppingImageUrl && !croppedImageUrl && (
                <Box>
                  <Button
                    sx={{ mt: 2 }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <VisuallyHiddenInput accept=".jpg,.jpeg,.png,.bmp,.webp,.svg" type="file" name="image" onChange={handleFileUpload} />
                  </Button>
                </Box>
              )}
              {croppingImageUrl && (
                <Box sx={{ mt: 2 }}>
                  {uploading ? (
                    <LoadingButton sx={{ mr: 1, mb: 1 }} loading variant="contained" color="primary">
                      Crop
                    </LoadingButton>
                  ) : (
                    <Button sx={{ mr: 1, mb: 1 }} onClick={handleCrop} variant="contained" color="primary">
                      Crop
                    </Button>
                  )}
                  <Button sx={{ mb: 1 }} onClick={() => { setCroppingImage(null); setCroppingImageUrl(null); }} variant="contained" color="inherit">
                    Cancel
                  </Button>
                  <Cropper
                    src={croppingImageUrl}
                    style={{ height: 400, width: '100%' }}
                    initialAspectRatio={1}
                    aspectRatio={1}
                    guides={false}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={Boolean(true)}
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                  />
                </Box>
              )}
              {croppedImageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img src={croppedImageUrl} alt="Cropped" style={{ width: '100%' }} />
                  <Button sx={{ mt: 2 }} onClick={() => { setCroppedImageUrl(null); setCroppingImageUrl(null); }} variant="contained" color="inherit">
                    Change Image
                  </Button>
                </Box>
              )}
            </Grid>
          </form>
        </Container>
      </DialogContent>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => { setOpenSnackbar(false); }}>
        <Alert
          onClose={() => { setOpenSnackbar(false); }}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
