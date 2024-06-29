import PropTypes from 'prop-types';
import { useEffect, useState, forwardRef, useContext } from 'react';
import axios from 'axios';
// @mui
import {
  Box,
  Stack,
  Button,
  Divider,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------
import AppNewsUpdate from '../app/AppNewsUpdate'; // Adjust import if necessary
import AppOrder from '../app/AppOrder';
import { AuthContext } from '../../../helpers/AuthContext';
import { CartContext } from '../../../helpers/CartContext';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

ShopCartSidebar.propTypes = {
  onCloseCart: PropTypes.func,
  setSnackbarContent: PropTypes.func,
  setSnackbarSeverity: PropTypes.func,
  setOpenSnackbar: PropTypes.func,
};

export default function ShopCartSidebar({ onCloseCart, setSnackbarContent, setSnackbarSeverity, setOpenSnackbar }) {
  const [totalMenuPrice, setTotalMenuPrice] = useState(0);
  const [totalArticlePrice, setTotalArticlePrice] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { authState } = useContext(AuthContext); // Added setAuthState to update auth state
  const { refreshCartLenght } = useContext(CartContext);
  const userInfo = authState.userInfo;
  const [cartHave, setCartHave] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('cart')!=='[]'){
      console.log(true)
      setCartHave(true)
    }else{
      console.log(false)
      setCartHave(false)
    }
  },[refreshCartLenght])
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const refreshCart = () => {
    setRefresh(prev => !prev);
  };

  const handleSnackbarContent = (state) => {
    setSnackbarContent(state);
  };

  const handleSnackbarSeverity = (state) => {
    setSnackbarSeverity(state);
  };

  const handleOpenSnackbar = (state) => {
    setOpenSnackbar(state);
  };

  const handleSubmit = async () => {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    try {
      const response = await axios.post(`${process.env.REACT_APP_IP_ADDRESS}/order/${userInfo.id}`, {cartItems, total: combinedTotalPrice}, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          apikey: process.env.REACT_APP_API_KEY,
        },
      });
      handleCloseDialog();
      onCloseCart();
      setSnackbarContent(response.data.message || 'Order placed successfully');
      setSnackbarSeverity('success');
      localStorage.removeItem('cart')
      refreshCartLenght()
    } catch (error) {
      setSnackbarContent(error.response?.data?.error || 'Failed to place order');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const combinedTotalPrice = totalMenuPrice + totalArticlePrice;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
        <Typography variant="h5" sx={{ ml: 1 }}>
          Panier
        </Typography>
        <IconButton onClick={onCloseCart}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          <AppNewsUpdate
            title="Menus"
            list={JSON.parse(localStorage.getItem('cart'))?.filter(item => item.type === 'menu') || []}
            totalPrice={totalMenuPrice}
            setTotalPrice={setTotalMenuPrice}
            refreshCart={refreshCart}
          />
          <AppNewsUpdate
            title="Articles"
            list={JSON.parse(localStorage.getItem('cart'))?.filter(item => item.type === 'article') || []}
            totalPrice={totalArticlePrice}
            setTotalPrice={setTotalArticlePrice}
            refreshCart={refreshCart}
          />
        </Stack>
      </Scrollbar>
      <Divider />
      <Box sx={{ p: 3 }}>
        <Stack sx={{ mb: 1 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">
            Subtotal:
          </Typography>
          <Typography variant="body2">
            {combinedTotalPrice} DA
          </Typography>
        </Stack>
        <Stack sx={{ mb: 1 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">
            Shippment:
          </Typography>
          <Typography variant="body2">
            {cartHave ? '200' : '0'} DA
          </Typography>
        </Stack>
        <Stack sx={{ mb: 1 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Total:
          </Typography>
          <Typography variant="body1">
          {cartHave ? combinedTotalPrice + 200 : '0'}{} DA
          </Typography>
        </Stack>

        <Button
          fullWidth
          size="large"
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleOpenDialog}
        >
          Order
        </Button>
      </Box>
      <Dialog
        TransitionComponent={Transition}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to submit this order?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You'll be able to cancel your order only before it gets validated by the restaurant.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleSubmit} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
