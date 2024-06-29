import PropTypes from 'prop-types';
import { Button, Dialog,styled ,  DialogActions, DialogContent, DialogTitle, useMediaQuery, Autocomplete, TextField, Slide, AppBar, Toolbar, Typography, IconButton, Container, Grid,
  ImageList ,ImageListItem 
 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';

ProductAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});
const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
];
const StyledImage = styled('img')({
  objectFit: 'cover', // Crop the image to cover the entire space
  objectPosition: 'center', // Center the image within the container
  width: '100%', // Ensure the image takes the full width of the container
  height: '100%', // Ensure the image takes the full height of the container
});
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

export default function ProductAdd({ open, handleClose }) {
  // brandList
  const [brandList, setBrandList] = useState([]);
  const [brandSelected, setBrandSelected] = useState(null);
  // typeList
  const [typeList, setTypeList] = useState([]);
  const [typeSelected, setTypeSelected] = useState(null);
  // categoryList
  const [categoryList, setCategoryList] = useState([]);
  const [categorySelected, setCategorySelected] = useState(null);
  // subCategoryList
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subCategorySelected, setSubCategorySelected] = useState(null);
  // image
  const [images, setImages] = useState([]);

  // others
  const theme = useTheme();

  const lgBreakpoint = useMediaQuery(theme.breakpoints.down('lg'));
  const mdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/type`)
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setTypeList(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/brand`)
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setBrandList(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleTypeChange = (event, newValue) => {
    if (!newValue) {
      setTypeSelected(null);
      setCategoryList([]);
      setCategorySelected(null);
      setSubCategoryList([]);
      setSubCategorySelected(null);
      return;
    }

    setTypeSelected(newValue.id);
    axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/category/${newValue.id}`)
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setCategoryList(response.data);
          setCategorySelected(null);
          setSubCategoryList([]);
          setSubCategorySelected(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCategoryChange = (event, newValue) => {
    if (!newValue) {
      setCategorySelected(null);
      setSubCategoryList([]);
      setSubCategorySelected(null);
      return;
    }

    setCategorySelected(newValue.id);
    axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/subcategory/${newValue.id}`)
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setSubCategoryList(response.data);
          setSubCategorySelected(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleSubCategoryChange = (event, newValue) => {
    if (!newValue) {
      setSubCategorySelected(null);

      return;
    }
    setSubCategorySelected(newValue.id);
  }
  const handleBrandChange = (event, newValue) => {
    if (!newValue) {
      setBrandSelected(null);
      return;
    }
    setBrandSelected(newValue.id);
  }


  const handleFileUpload = (event) => {
    const files = event.target.files;
    setImages((prevImages) => [...prevImages, ...files]);
  };
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Ajouter un produit
          </Typography>
          <Button autoFocus sx={{mr: 2}} variant='contained' color="inherit" onClick={handleClose}>
            Annuler
          </Button>
          <Button autoFocus variant='contained' color="primary" onClick={handleClose}>
            Sauvgader
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 5}}>
        <Container>
          <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
              <TextField label="Reference" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Titre" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Prix" type="number" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Quantité" type="number" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline fullWidth />
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Autocomplete
                disablePortal
                options={typeList}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Type" />}
                onChange={handleTypeChange}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Autocomplete
                disablePortal
                options={categoryList}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Categorie" />}
                onChange={handleCategoryChange}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Autocomplete
                disablePortal
                options={subCategoryList}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Sous category" />}
                onChange={handleSubCategoryChange}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Autocomplete
                disablePortal
                options={brandList}
                getOptionLabel={(option) => option.name}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Marque" />}
                onChange={handleBrandChange}
              />
            </Grid>
          </Grid>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} multiple />
          </Button>

          {/* ImageList to display uploaded images */}
          <ImageList sx={{ width: '100%', height: 300 }} variant="masonry" cols={4}>
            {images.map((file, index) => (
              <ImageListItem key={index} sx={{ width: 200, height: 200 }}>
              <StyledImage src={URL.createObjectURL(file)} alt={`Uploaded ${index}`} />
            </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
