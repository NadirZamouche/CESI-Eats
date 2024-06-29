import PropTypes from 'prop-types';
import React, { useContext } from 'react';

// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
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
  product: PropTypes.object,
};

export default function ShopProductCard({ product, selected }) {
  const navigate = useNavigate();
  const { refreshCartLenght } = useContext(CartContext);

  const { _id, name, path, price, category, Restaurateur } = product;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex((item) => item._id === _id);
      if (existingProductIndex !== -1) {
      const newQuantity = cart[existingProductIndex].quantity + 1;
        cart[existingProductIndex].quantity = newQuantity;
      } else {
        cart.push({ _id, quantity: 1, price, name, path, type:"article", restaurateur:Restaurateur });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    

    refreshCartLenght()
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
        >{Restaurateur.name}</Label>
        <StyledProductImg alt={name} src={`http://localhost:5010/uploads/${path}`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {category} 
        </Typography>

      </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Typography variant="subtitle1">
            {/* <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography> */}
            &nbsp;
            {fCurrency(price)}
          </Typography>
          <Button variant="contained" onClick={addToCart} size="small">Add to cart</Button>
        </Stack>
      </Stack>
    </Card>
  );
}
