import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import ShopMenuCard from './MenuCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList({ products, selected, ...other }) {
  return (
    <>
    {selected==="articles" &&
      <Grid container spacing={3} {...other}>
        
          {products.map((product) => (
            <Grid key={product._id} item xs={12} sm={6} md={3}>
              <ShopProductCard product={product} />
            </Grid>
          ))}
      </Grid>
      }
      {selected==="menus" &&
      <Grid container spacing={3} {...other}>
        
          {products.map((product) => (
            <Grid key={product._id} item xs={12} sm={6} md={3}>
              <ShopMenuCard product={product} />
            </Grid>
          ))}
      </Grid>
      }
    </>
    
  );
}
