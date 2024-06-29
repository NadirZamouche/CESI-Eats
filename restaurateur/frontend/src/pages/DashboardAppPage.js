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
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/order/restaurateur/${userInfo.id}`, {
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
  
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
  
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const orderDay = orderDate.getDay(); // Get the day of the week (0-6, where 0 is Sunday)
  
      totalSales += order.price;
  
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
      ordersByDayOfWeek[orderDay] += 1;
  
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
            <AppWidgetSummary title="Total Sales This Year" total={statistics.totalSalesThisYear} color="secondary" icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Sales This Month" total={statistics.totalSalesThisMonth} color="warning" icon={'ant-design:calendar-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Orders" total={statistics.totalOrders} icon={'ant-design:shopping-cart-outlined'} />
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

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}


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

          
          

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
