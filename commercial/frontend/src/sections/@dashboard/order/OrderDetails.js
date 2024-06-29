import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OrderDetailsDialog = ({ open, onClose, order }) => {
  const [restaurateur, setRestaurateur] = useState(null);
  const [client, setClient] = useState(null);
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    if (open && order) {
      axios.get(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/user/${order.Client.ID_user}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
          apikey: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setClient(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      
      axios.get(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/user/${order.Restaurateur.ID_user}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
          apikey: process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          setRestaurateur(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      if(order.Delivery){
        axios.get(`${process.env.REACT_APP_AUTH_IP_ADDRESS}/user/${order.Delivery.ID_user}`, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            apikey: process.env.REACT_APP_API_KEY,
          },
        })
        .then((response) => {
          if (response.data.error) {
            console.error(response.data.error);
          } else {
            setDelivery(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  }, [open, order]);

  if (!order) return null;

  const calculateTotalPrice = (items, type) => {
    return items.reduce((total, item) => total + (item[type]?.price || 0) * item.quantity, 0);
  };

  const calculateIndividualArticlesTotal = (articles, quantity) => {
    return articles.reduce((total, article) => total + article.price, 0) * quantity;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Grid container spacing={3} sx={{ p: 1 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Restaurateur info
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {restaurateur ? restaurateur.user.phone : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Name: {restaurateur ? restaurateur.roleDetails.name : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Email: {restaurateur ? restaurateur.user.email : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Address: {restaurateur ? restaurateur.roleDetails.address : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Client info
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {client ? client.user.phone : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Name: {client ? `${client.user.first_name} ${client.user.last_name}` : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Email: {client ? client.user.email : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Address: {client ? client.roleDetails.address : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {delivery &&
          <Grid item xs={12} sm={12}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Delivery info
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {delivery ? delivery.user.phone : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Name: {delivery ? `${delivery.user.first_name} ${delivery.user.last_name}` : 'Loading...'}
              </Typography>
              <Typography variant="body2">
                Email: {delivery ? delivery.user.email : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        }
      </Grid>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" gutterBottom>
          State: {order.state}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Order Price: ${order.price}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Delivery Price: ${order.del_price}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total Price: ${order.price + order.del_price}
        </Typography>
        

        <Typography variant="h6" gutterBottom>
          Articles Ordered
        </Typography>
        <List>
          {order.Article && order.Article.map((article, index) => (
            <ListItem key={article.articleId?._id || index}>
              <ListItemText
              sx={{ 
                border: '1px solid rgba(0, 0, 0, 0.12)', 
                mb:0.5,
                borderRadius:2,
                p:1
              }}
                primary={`${article.articleId?.name} - Quantity: ${article.quantity} - Unit Price: $${article.articleId?.price}`}
                secondary={`Total: $${article.quantity * (article.articleId?.price || 0)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1">
          Total articles price: ${order.Article ? calculateTotalPrice(order.Article, 'articleId') : 0}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Menus Ordered
        </Typography>
        {order.Menu && order.Menu.map((menu, index) => (
          <Accordion key={menu.menuId?._id || index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {menu.menuId?.name} - Quantity: {menu.quantity} - Unit Price: ${menu.menuId?.price}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {menu.menuId?.Article && menu.menuId.Article.map((article, idx) => (
                  <ListItem 
                  key={article._id || idx}
                  sx={{ 
                    border: '1px solid rgba(0, 0, 0, 0.12)', 
                    mb:0.5,
                    borderRadius:2
                  }}
                >
                  <ListItemText 
                    primary={`${article.name} - Unit Price: $${article.price}`}
                  />
                </ListItem>
                
                ))}
              </List>
              <Typography variant="subtitle1">
                Total: ${menu.quantity * (menu.menuId?.price || 0)}
              </Typography>
              <Typography variant="subtitle1">
                Total if bought individually:
                <span style={{ textDecoration: 'line-through' }}>
                  ${calculateIndividualArticlesTotal(menu.menuId?.Article, menu.quantity)}
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <Typography variant="subtitle1">
          Total menus price: ${order.Menu ? calculateTotalPrice(order.Menu, 'menuId') : 0}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
