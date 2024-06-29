import React from 'react';
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
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const calculateTotalPrice = (items, type) => {
    return items.reduce((total, item) => total + (item[type]?.price || 0) * item.quantity, 0);
  };

  const calculateIndividualArticlesTotal = (articles, quantity) => {
    return articles.reduce((total, article) => total + article.price, 0) * quantity;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Client Address: {order.Client?.address}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Order Price: ${order.price}
        </Typography>
        <Typography variant="h6" gutterBottom>
          State: {order.state}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Articles Ordered
        </Typography>
        <List>
          {order.Article && order.Article.map((article, index) => (
            <ListItem key={article.articleId?._id || index}>
              <ListItemText
                primary={`${article.articleId?.name} - Quantity: ${article.quantity} - Unit Price: $${article.articleId?.price}`}
                secondary={`Total: $${article.quantity * (article.articleId?.price || 0)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1">
          Total: ${order.Article ? calculateTotalPrice(order.Article, 'articleId') : 0}
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
                  <ListItem key={article._id || idx}>
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
          Total: ${order.Menu ? calculateTotalPrice(order.Menu, 'menuId') : 0}
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
