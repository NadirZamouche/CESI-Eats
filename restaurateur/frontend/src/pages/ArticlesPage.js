import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
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
  Alert,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { ProductListHead, ProductListToolbar, ProductAdd, ProductEdit } from '../sections/@dashboard/article';
import { AuthContext } from "../helpers/AuthContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterTitle, setFilterTitle] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const { authState, setAuthState } = useContext(AuthContext); // Added setAuthState to update auth state
  const userInfo = authState.userInfo;


  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    handleCloseMenu();
    setEditId(null);
    setOpenEdit(false);
  };

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setEditId(id);  // Set the id of the item to be edited or deleted
    setSelected([]);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setEditId(null);  // Reset the id of the item to be edited or deleted
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((product) => product._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTitle = (event) => {
    setPage(0);
    setFilterTitle(event.target.value);
  };

  const handleMessageShow = (response) => {
    setOpenSnackbar(response);
  };

  const handleMessage = (response) => {
    if (response.message) {
      setMessage(response.message);
      setSnackbarSeverity("success");
      if (response.newProduct) {
        setProducts([...products, response.newProduct]);
      } else if (response.getEditedProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === response.getEditedProduct._id ? response.getEditedProduct : product
          )
        );
      }
    } else if (response.error) {
      setMessage(response.error);
      setSnackbarSeverity("error");
    } else {
      setMessage(response);
      setSnackbarSeverity("error");
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/articles/restaurateur/${userInfo.id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setProducts(response.data);
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle the error, e.g., redirect to an error page or show a relevant message to the user.
    });
  }, []);

  const filteredProducts = filter(products, (product) =>
    product.name.toLowerCase().includes(filterTitle.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (orderBy === 'name' || orderBy === 'category') {
      return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
    }
    return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
  });

  const handleDelete = () => {
    if (editId) {
      axios
        .delete(`${process.env.REACT_APP_IP_ADDRESS}/articles/${editId}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        })
        .then((response) => {
          if (response.data.error) {
            setMessage(response.data.error);
            setOpenSnackbar(true);
            setSnackbarSeverity("error");
          } else {
            setMessage(response.data.message);
            setOpenSnackbar(true);
            setSnackbarSeverity("success");
            setProducts(products.filter((product) => product._id !== editId));
            const deletePath = response.data.path;
            handleCloseMenu();
            setSelected([]);
            // Now send a request to delete the image
            axios
              .delete(`http://localhost:5010/api/uploads/${deletePath}`)
              .then((imageResponse) => {
                console.log('Image deleted:', imageResponse.data);
              })
              .catch((imageError) => {
                console.error('Error deleting image:', imageError);
                // Optionally, you can handle image deletion error here
              });
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage(error.message);
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
        });
    }
  };
  

  const isNotFound = !filteredProducts.length && !!filterTitle;

  return (
    <>
      <Helmet>
        <title>Product | Minimal UI</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Articles
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Article
          </Button>
          <ProductAdd open={openAdd} handleClose={handleCloseAdd} handleMessage={handleMessage} handleMessageShow={handleMessageShow} />
        </Stack>

        <Card>
          <ProductListToolbar
            numSelected={selected.length}
            filterTitle={filterTitle}
            onFilterTitle={handleFilterByTitle}
            handleDelete={handleDelete}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {sortedProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      const { _id, name, category, price, path } = product;
                      const selectedProduct = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedProduct}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, _id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{category}</TableCell>

                          <TableCell align="left">{price}</TableCell>


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
                            <strong>&quot;{filterTitle}&quot;</strong>.
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
            count={products.length}
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
        <MenuItem onClick={handleOpenEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <ProductEdit open={openEdit} editId={editId} handleClose={handleCloseEdit} handleMessage={handleMessage} handleMessageShow={handleMessageShow} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => { setOpenSnackbar(false); }}>
        <Alert
          onClose={() => { setOpenSnackbar(false); }}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
