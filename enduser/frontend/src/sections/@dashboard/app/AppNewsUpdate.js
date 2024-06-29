import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { Box, Stack, Link, IconButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Remove, Add, Delete } from '@mui/icons-material';
import { CartContext } from '../../../helpers/CartContext';

AppNewsUpdate.propTypes = {
  list: PropTypes.array.isRequired,
  setTotalPrice: PropTypes.func.isRequired,
  refreshCart: PropTypes.func.isRequired,
};

export default function AppNewsUpdate({ list, setTotalPrice, refreshCart }) {
  useEffect(() => {
    const total = list.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [list, setTotalPrice]);

  return (
    <Stack spacing={3} sx={{ pr: 0 }}>
      {list.map((item) => (
        <NewsItem key={item._id} item={item} setTotalPrice={setTotalPrice} refreshCart={refreshCart} />
      ))}
    </Stack>
  );
}

NewsItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  setTotalPrice: PropTypes.func.isRequired,
  refreshCart: PropTypes.func.isRequired,
};

function NewsItem({ item, setTotalPrice, refreshCart }) {
  const { _id, images, name, price, quantity, path, type, restaurateur } = item;
  const [number, setNumber] = useState(0);
  const { refreshCartLenght } = useContext(CartContext);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cartItems.find(item => item._id === _id);
    if (cartItem) {
      setNumber(cartItem.quantity);
    }
  }, [_id]);

  const handleIncrement = () => {
    if (number < 100) {
      const newQuantity = number + 1;
      setNumber(newQuantity);
      updateCartQuantity(_id, newQuantity);
      setTotalPrice(prevTotal => prevTotal + price);
      refreshCart();
    }
  };

  const handleDecrement = () => {
    if (number > 1) {
      const newQuantity = number - 1;
      setNumber(newQuantity);
      updateCartQuantity(_id, newQuantity);
      setTotalPrice(prevTotal => prevTotal - price);
      refreshCart();
    }
  };

  const handleDelete = () => {
    removeFromCart(_id);
    setTotalPrice(prevTotal => prevTotal - (price * number));
    refreshCart();
    refreshCartLenght();
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cartItems.findIndex(item => item._id === itemId);
    if (index !== -1) {
      cartItems[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  };

  const removeFromCart = (itemId) => {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item._id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setNumber(0);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={name} src={path ? `http://localhost:5010/uploads/${path}` : `/assets/illustrations/indisponible.png`} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
      <Box sx={{ minWidth: 150, flexGrow: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }} color="inherit" variant="subtitle2" underline="hover" noWrap>
          {name}
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {restaurateur.name} 
        </Typography>

      </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ border: '1px solid black', borderRadius: '15px', borderColor: grey[300] }}>
            <IconButton aria-label="decrement" sx={{ pr: 1 }} onClick={handleDecrement} size="small" disabled={number <= 1}>
              <Remove fontSize="inherit" />
            </IconButton>
            {number}
            <IconButton onClick={handleIncrement} aria-label="increment" sx={{ pl: 1 }} size="small" disabled={number >= 100}>
              <Add fontSize="inherit" />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {price} DA
          </Typography>
        </Stack>
      </Box>
      <IconButton aria-label="delete" size="small" onClick={handleDelete}>
        <Delete color='error' />
      </IconButton>
    </Stack>
  );
}
