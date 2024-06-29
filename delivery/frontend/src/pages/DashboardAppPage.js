import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar, OrderDetailsDialog } from '../sections/@dashboard/order';
import { AuthContext } from "../helpers/AuthContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'clientAddress', label: 'Client Address', alignRight: false },
  { id: 'restaurateurAddress', label: 'Restaurateur Address', alignRight: false },
  { id: 'price', label: 'Order Price', alignRight: false },
  { id: 'delPrice', label: 'Delivery Price', alignRight: false },
  { id: 'state', label: 'State', alignRight: false },
  { id: '' },
];

// Define the custom order of states
const stateOrder = [
  'new_order',
  'preparing',
  'ready_to_deliver',
  'in_delivery',
  'order_complete',
  'canceled_by_client',
  'canceled_by_restaurateur'
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'state') {
    return stateOrder.indexOf(b[orderBy]) - stateOrder.indexOf(a[orderBy]);
  }
  if (orderBy === 'createdAt') {
    return new Date(b[orderBy]) - new Date(a[orderBy]);
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_order) => _order.Client.address.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
  const [open, setOpen] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('clientAddress');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { authState } = useContext(AuthContext);
  const userInfo = authState.userInfo;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/order/delivery`, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        const ordersData = response.data.map(order => ({
          ...order,
          delPrice: order.del_price
        }));
        setOrders(ordersData);
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle the error, e.g., redirect to an error page or show a relevant message to the user.
    });
  }, [userInfo.id]);

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setOpenOrderId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setOpenOrderId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.Client.address);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, address) => {
    const selectedIndex = selected.indexOf(address);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, address);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleValidateOrder = (id) => {
    axios.post(`${process.env.REACT_APP_IP_ADDRESS}/order/take/${userInfo.id}`, { id }, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      setOrders(orders.filter(order => order._id !== id));
      setSnackbar({ open: true, message: 'Order has been taken', severity: 'success' });
      handleCloseMenu();
    })
    .catch((error) => {
      setSnackbar({ open: true, message: 'Error updating order status', severity: 'error' });
      console.error(error);
    });
  };

  const handleCancelOrder = (id) => {
    axios.put(`${process.env.REACT_APP_IP_ADDRESS}/order/${id}`, { state: 'canceled_by_restaurateur' }, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      setOrders(orders.map(order => order._id === id ? { ...order, state: 'canceled_by_restaurateur' } : order));
      setSnackbar({ open: true, message: 'Order has been canceled', severity: 'success' });
      handleCloseMenu();
    })
    .catch((error) => {
      setSnackbar({ open: true, message: 'Error updating order status', severity: 'error' });
      console.error(error);
    });
  };

  const handleViewOrder = (id) => {
    const order = orders.find(order => order._id === id);
    setSelectedOrder(order);
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredOrders = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredOrders.length && !!filterName;

  const getStateColor = (state) => {
    switch (state) {
      case 'new_order':
        return 'info';
      case 'canceled_by_client':
      case 'canceled_by_restaurateur':
        return 'error';
      case 'preparing':
        return 'warning';
      case 'ready_to_deliver':
        return 'primary';
      case 'in_delivery':
        return 'info';
      case 'order_complete':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Orders | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Orders
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, Client, Restaurateur, price, delPrice, state, createdAt } = row;
                    const selectedOrder = selected.indexOf(Client.address) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedOrder}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedOrder} onChange={(event) => handleClick(event, Client.address)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {Client.address}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{Restaurateur.address}</TableCell>
                        
                        <TableCell align="left">{price}</TableCell>

                        <TableCell align="left">{delPrice}</TableCell>

                        <TableCell align="left">
                          <Label color={getStateColor(state)}>{sentenceCase(state.replace(/_/g, ' '))}</Label>
                        </TableCell>
                        
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, _id)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleValidateOrder(openOrderId)} sx={{ color: 'success.main' }}>
          <Iconify icon={'eva:checkmark-circle-fill'} sx={{ mr: 2 }} />
          Take
        </MenuItem>
        <MenuItem onClick={() => handleViewOrder(openOrderId)}>
          <Iconify icon={'eva:eye-outline'} sx={{ mr: 2 }} />
          View
        </MenuItem>
      </Popover>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <OrderDetailsDialog open={dialogOpen} onClose={handleCloseDialog} order={selectedOrder} />
    </>
  );
}
