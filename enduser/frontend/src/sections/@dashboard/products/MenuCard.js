import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react';
// @mui
import { Box, Card, Link, Typography, Stack, Popover, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import MenuDialog from './MenuDialog'
import { CartContext } from '../../../helpers/CartContext';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default function ShopProductCard({ product }) {
  const navigate = useNavigate();
  const { refreshCartLenght } = useContext(CartContext);

  const [openDialog, setOpenDialog] = useState(false)
  const { _id, name, path, price, status, Article } = product;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex((item) => item._id === _id);
      if (existingProductIndex !== -1) {
      const newQuantity = cart[existingProductIndex].quantity + 1;
        cart[existingProductIndex].quantity = newQuantity;
      } else {
        cart.push({ _id, quantity: 1, price, name, path, type:"menu", restaurateur: Article[0].Restaurateur });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    

    refreshCartLenght()
  };

  const handleClick = (event) => {
    setOpenDialog(true)
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
  };


  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
      <Label
          sx={{
            zIndex: 9,
            top: 16,
            right: 16,
            position: 'absolute',
            backgroundColor: "rgba(202, 202, 202, 0.77)",
          }}
        >{Article[0].Restaurateur.name}</Label>
        <StyledProductImg alt={name} src={`http://localhost:5010/uploads/${path}`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" onClick={handleClick}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            &nbsp;
            {fCurrency(price)}
          </Typography>
          <Button variant="contained" onClick={addToCart} size="small">Add to cart</Button>

        </Stack>

      </Stack>
      <MenuDialog open={openDialog} handleClose={handleCloseDialog} Article={Article} />
     
    </Card>
  );
}
