import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importer PropTypes
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, TextField, Autocomplete, DialogContent, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';


const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AppOrder({ handleClose, open, handleSnackbarContent, handleSnackbarSeverity, handleCloseCart, handleOpenSnackbar }) {
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [filteredCommunes, setFilteredCommunes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false); // État de chargement

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, [open]);


  

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar color="inherit" sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Passer une commande
          </Typography>
          {!loading ?
            <Button autoFocus variant="contained" color="secondary" >
              Commander
            </Button>
            :
            <LoadingButton sx={{ mr: 1, mb: 1 }} loading variant="contained" color="inherit">
              Commander
            </LoadingButton>
          }
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        sfdg
      </DialogContent>
    </Dialog>
  );
}

AppOrder.propTypes = {
  handleClose: PropTypes.func.isRequired, // Ajouter la validation de prop type pour handleClose
  open: PropTypes.bool.isRequired, // Ajouter la validation de prop type pour open
  handleSnackbarContent: PropTypes.func.isRequired, // Ajouter la validation de prop type pour handleSnackbarContent
  handleSnackbarSeverity: PropTypes.func.isRequired, // Ajouter la validation de prop type pour handleSnackbarSeverity
  handleCloseCart: PropTypes.func.isRequired, // Ajouter la validation de prop type pour handleCloseCart
  handleOpenSnackbar: PropTypes.func.isRequired, // Ajouter la validation de prop type pour handleOpenSnackbar
};
