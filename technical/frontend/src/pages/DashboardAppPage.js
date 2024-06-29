import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardContent } from '@mui/material';
// components
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
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

const microservices = [
  { name: 'Technical', endpoint: 'technical' },
  { name: 'EndUser', endpoint: 'enduser' },
  { name: 'Restaurateur', endpoint: 'restaurateur' },
  { name: 'Delivery', endpoint: 'delivery' },
  { name: 'Developer', endpoint: 'developer' },
  { name: 'Commercial', endpoint: 'commercial' },
];

const fetchPerformanceData = async (endpoint) => {
  try {
    const response = await axios.get(`http://localhost:5000/${endpoint}/api/performance`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        apikey: process.env.REACT_APP_API_KEY,
      },
    });
    if (response.data.error) {
      console.error(response.data.error);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function DashboardAppPage() {
  const theme = useTheme();
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = microservices.map(async (service) => {
          const data = await fetchPerformanceData(service.endpoint);
          return { [service.name]: data };
        });

        const results = await Promise.all(promises);
        const data = results.reduce((acc, result) => ({ ...acc, ...result }), {});
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          {microservices.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{service.name} Performance</Typography>
                  {performanceData[service.name] ? (
                    <>
                      <AppCurrentVisits
                        sx={{mb:1}}
                        title={`Total RAM Usage: ${performanceData[service.name].ramUsage.total}`}
                        chartData={[
                          { label: `Used: ${performanceData[service.name].ramUsage.used}`, value: parseFloat(performanceData[service.name].ramUsage.used) },
                          { label: `Free: ${performanceData[service.name].ramUsage.free}`, value: parseFloat(performanceData[service.name].ramUsage.free) },
                        ]}
                        chartColors={[
                          theme.palette.warning.main,
                          theme.palette.primary.main,
                        ]}
                      />
                      <AppConversionRates
                        title="CPU Usage (%)"
                        subheader={`(${service.name})`}
                        chartData={performanceData[service.name].cpuUsage.map((cpu, index) => ({
                          label: Object.keys(cpu)[0],
                          value: parseFloat(cpu[Object.keys(cpu)[0]].usage),
                        }))}
                      />
                    </>
                  ) : (
                    <Typography variant="body2">Loading...</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
