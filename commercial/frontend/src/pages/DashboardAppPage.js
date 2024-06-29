import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { faker } from '@faker-js/faker';

import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { AuthContext } from "../helpers/AuthContext";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const { authState } = useContext(AuthContext);
  const userInfo = authState.userInfo;
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSalesToday: 0,
    totalOrders: 0,
    totalNewOrders: 0,
    totalCanceledOrders: 0,
    totalCompletedOrders: 0,
    categoryData: [],
    menuOrders: 0,
    articleOrders: 0,
    totalSalesThisMonth: 0,
    totalSalesThisYear: 0,
    ordersInProgress: 0,
    ordersByDayOfWeek: [],
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/order`, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        const ordersData = response.data;
        setOrders(ordersData);
        calculateStatistics(ordersData);
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle the error, e.g., redirect to an error page or show a relevant message to the user.
    });
  }, [userInfo.id]);

  const calculateStatistics = (orders) => {
    let totalSales = 0;
    let totalSalesToday = 0;
    let totalSalesThisMonth = 0;
    let totalSalesThisYear = 0;
    const totalOrders = orders.length;
    let totalNewOrders = 0;
    let totalCanceledOrders = 0;
    let totalCompletedOrders = 0;
    let ordersInProgress = 0;
    let menuOrders = 0;
    let articleOrders = 0;
    const categoryCounts = {};
    const ordersByDayOfWeek = Array(7).fill(0); // Initialize array to hold orders for each day of the week
  
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderDay = orderDate.getDate();
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const orderWeekDay = orderDate.getDay(); // Get the day of the week (0-6, where 0 is Sunday)
  
      totalSales += order.price;

      if (orderDay === currentDay && orderMonth === currentMonth && orderYear === currentYear) {
        totalSalesToday += order.price;
      }
  
      if (orderMonth === currentMonth && orderYear === currentYear) {
        totalSalesThisMonth += order.price;
      }
  
      if (orderYear === currentYear) {
        totalSalesThisYear += order.price;
      }
  
      if (order.state === 'new_order') {
        totalNewOrders += 1;
      } else if (order.state === 'canceled_by_client' || order.state === 'canceled_by_restaurateur') {
        totalCanceledOrders += 1;
      } else if (order.state === 'order_complete') {
        totalCompletedOrders += 1;
      } else if (order.state === 'preparing' || order.state === 'ready_to_deliver' || order.state === 'in_delivery') {
        ordersInProgress += 1;
      }
  
      if (order.Menu.length > 0) {
        menuOrders += 1;
      }
  
      if (order.Article.length > 0) {
        articleOrders += 1;
      }
  
      // Increment the count for the corresponding day of the week
      ordersByDayOfWeek[orderWeekDay] += 1;
  
      order.Menu.forEach(menuItem => {
        menuItem.menuId.Article.forEach(article => {
          if (categoryCounts[article.category]) {
            categoryCounts[article.category] += 1;
          } else {
            categoryCounts[article.category] = 1;
          }
        });
      });
  
      order.Article.forEach(articleItem => {
        const article = articleItem.articleId;
        if (categoryCounts[article.category]) {
          categoryCounts[article.category] += 1;
        } else {
          categoryCounts[article.category] = 1;
        }
      });
    });
  
    const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
      label: category,
      value: count,
    }));
  
    setStatistics({
      totalSales,
      totalSalesToday,
      totalOrders,
      totalNewOrders,
      totalCanceledOrders,
      totalCompletedOrders,
      categoryData,
      menuOrders,
      articleOrders,
      totalSalesThisMonth,
      totalSalesThisYear,
      ordersInProgress,
      ordersByDayOfWeek,
    });
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {userInfo.first_name}, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Sales" total={statistics.totalSales} icon={'ant-design:dollar-circle-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Sales Today" total={statistics.totalSalesToday} color="primary" icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Sales This Year" total={statistics.totalSalesThisYear} color="secondary" icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Sales This Month" total={statistics.totalSalesThisMonth} color="warning" icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Orders" total={statistics.totalNewOrders} color="info" icon={'ant-design:shopping-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Completed Orders" total={statistics.totalCompletedOrders} color="success" icon={'ant-design:check-circle-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Canceled Orders" total={statistics.totalCanceledOrders} color="error" icon={'ant-design:close-circle-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Orders in Progress" total={statistics.ordersInProgress} color="info" icon={'ant-design:sync-outlined'} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppConversionRates
              title="Orders by Day of the Week"
              subheader="Percentage of orders by day of the week"
              chartData={statistics.ordersByDayOfWeek}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Menu vs Article Orders"
              chartData={[
                { label: 'Menu Orders', value: statistics.menuOrders },
                { label: 'Article Orders', value: statistics.articleOrders },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentSubject
              title="Most Ordered Categories"
              chartLabels={statistics.categoryData.map(data => data.label)}
              chartData={[
                {
                  name: 'Orders',
                  data: statistics.categoryData.map(data => data.value),
                }
              ]}
              chartColors={[...Array(statistics.categoryData.length)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
