import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
import { ProductListHead } from '../sections/@dashboard/log';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'value', label: 'Authentication / download history', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function LogPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    console.log("Fetching logs from backend...");
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/logs`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error("Error fetching logs:", response.data.error);
      } else {
        console.log("Logs fetched successfully:", response.data);
        // Sort logs by createdAt date in descending order
        const sortedLogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLogs(sortedLogs);
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>Logs | Minimal UI</title>
      </Helmet>

      <Container>
        <Typography variant="h4" gutterBottom>
          Logs
        </Typography>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={'desc'}
                  orderBy={'createdAt'}
                  headLabel={TABLE_HEAD}
                  rowCount={logs.length}
                />
                <TableBody>
                  {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => {
                    const { _id, value } = log;

                    return (
                      <TableRow hover key={_id} tabIndex={-1}>
                        <TableCell component="th" scope="row" sx={{ padding: '10px', paddingLeft: '29px' }}>
                          <Typography variant="subtitle2" noWrap>
                            {value}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={logs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

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
