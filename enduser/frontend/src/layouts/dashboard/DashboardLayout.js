import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Box, Drawer, Alert, Slide, Snackbar, useMediaQuery, useTheme } from '@mui/material';

import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import { CartContext } from '../../helpers/CartContext'; // Import the CartContext
import { ProductCartWidget, ProductCartSidebar } from '../../sections/@dashboard/products';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { openCart, handleOpenCart, handleCloseCart } = useContext(CartContext); // Use the context
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  
  const handleSnackbarContent = (state) => {
    setSnackbarContent(state)
  }
  const handleSnackbarSeverity = (state) => {
    setSnackbarSeverity(state)
  }
  const handleOpenSnackbar = (state) => {
    setOpenSnackbar(state)
  }
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Drawer
        anchor="right"
        open={openCart}
        onClose={handleCloseCart}
        PaperProps={{
          sx: { width: isXs ? '100%' : 300, // Set width to 100% for xs screen size
             border: 'none',
              overflow: 'hidden' 
            },
        }}
      >
        <ProductCartSidebar onCloseCart={handleCloseCart} setSnackbarContent={handleSnackbarContent} setSnackbarSeverity={handleSnackbarSeverity} setOpenSnackbar={handleOpenSnackbar} />
      </Drawer>
      <Main>
        <Outlet />
      </Main>
      <Snackbar open={openSnackbar} TransitionComponent={Slide} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <ProductCartWidget onOpenCart={handleOpenCart} />
      </Box>
    </StyledRoot>
  );
}
