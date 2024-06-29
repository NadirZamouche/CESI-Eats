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
import { useState, useEffect, forwardRef, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { LoadingButton } from '@mui/lab';
import { AuthContext } from "../../../helpers/AuthContext";

MenuEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
  editId: PropTypes.string,
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
  articles: Yup.array().min(1, 'At least one article is required'),
});

export default function MenuEdit({ open, handleClose, handleMessage, handleMessageShow, editId }) {
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    articles: [],
    path: ''
  });
  const [articles, setArticles] = useState([]);
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [fileExtensionName, setFileExtensionName] = useState("");
  const { authState, setAuthState } = useContext(AuthContext); // Added setAuthState to update auth state
  const userInfo = authState.userInfo;

  useEffect(() => {
    if (open) {
      axios.get(`${process.env.REACT_APP_IP_ADDRESS}/articles/restaurateur/${userInfo.id}`, {
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

      if (editId) {
        axios.get(`${process.env.REACT_APP_IP_ADDRESS}/menus/${editId}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        })
          .then((response) => {
            const menuData = response.data;
            const defaultArticles = articles.filter(article => menuData.Article && menuData.Article.includes(article._id));
            console.log(articles)
            setInitialValues({
              name: menuData.name,
              price: menuData.price,
              articles: response.data.Article,
              path: menuData.path,
            });
          })
          .catch((error) => {
            console.error("Error fetching menu data:", error);
            setErrorMessage(error.message);
            handleMessage(error.message);
            handleMessageShow(true);
          });
      }
    }
  }, [open]);

  const handleCloseEdit = () => {
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
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      let imageUrl = initialValues.path;

      try {
        if (croppingImage) {
          const formData = new FormData();
          formData.append('image', croppingImage, `image.${fileExtensionName}`);

          console.log("Uploading image to image service...");
          const imageUploadResponse = await axios.post('http://localhost:5010/api/uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              accessToken: localStorage.getItem("accessToken"),
            },
          });

          console.log("Image upload response:", imageUploadResponse.data);
          if (imageUploadResponse.data.error) {
            throw new Error(imageUploadResponse.data.error);
          }

          imageUrl = imageUploadResponse.data.path;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMessage(error.message);
        handleMessage(error.message);
        handleMessageShow(true);
        handleClose();
        return;
      }

      try {
        const menuData = {
          name: values.name,
          price: values.price,
          Article: values.articles.map(article => article._id),
          path: imageUrl,
        };

        console.log("Updating menu with data:", menuData);
        const menuResponse = await axios.put(`${process.env.REACT_APP_IP_ADDRESS}/menus/${editId}`, menuData, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        });

        console.log("Menu response:", menuResponse.data);
        if (menuResponse.data.error) {
          throw new Error(menuResponse.data.error);
        }

        if (croppingImage) {
          const imageDeleteResponse = await axios.delete(`http://localhost:5010/api/uploads/${initialValues.path}`);
          console.log(imageDeleteResponse);
        }

        formik.resetForm();
        setCroppingImage(null);
        setCroppedImageUrl(null);
        handleMessage(menuResponse.data);
        handleMessageShow(true);
        handleClose();

      } catch (error) {
        console.error("Error updating menu:", error);
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
          <IconButton edge="start" color="inherit" onClick={handleCloseEdit} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit a Menu
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
                  options={articles || []}
                  getOptionLabel={(option) => option.name || ''}
                  filterSelectedOptions
                  value={formik.values.articles || []}
                  defaultValue={initialValues.articles} // Set defaultValue to display existing articles
                  onChange={(event, value) => formik.setFieldValue('articles', value)}
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
                      <Chip variant="outlined" label={option.name || ''} {...getTagProps({ index })} />
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
                    {initialValues.path ? "Change Image" : "Upload Image"}
                    <VisuallyHiddenInput accept=".jpg,.jpeg,.png,.bmp,.webp,.svg" type="file" name="image" onChange={handleFileUpload} />
                  </Button>
                  {initialValues.path && (
                    <Box sx={{ mt: 2 }}>
                      {console.log(initialValues.path)}
                      <img src={`http://localhost:5010/uploads/${initialValues.path}`} alt="Menu" style={{ width: '100%' }} />
                    </Box>
                  )}
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
