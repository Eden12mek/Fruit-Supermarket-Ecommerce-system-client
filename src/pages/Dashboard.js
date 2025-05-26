import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { GiMoneyStack } from "react-icons/gi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import SummaryApi from '../common';
import moment from 'moment';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const user = useSelector(state => state?.user?.user);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    approvedPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [paymentTrend, setPaymentTrend] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
      });
      const usersData = await usersResponse.json();

      // Fetch products
      const productsResponse = await fetch(SummaryApi.allProduct.url, {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
      });
      const productsData = await productsResponse.json();

      // Fetch payments
      const paymentsResponse = await fetch(SummaryApi.getAllPayments.url, {
        method: SummaryApi.getAllPayments.method,
        credentials: 'include',
      });
      const paymentsData = await paymentsResponse.json();

     
      // Process payment trend (last 6 months)
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => 
        moment().subtract(i, 'months').format('MMM YYYY')
      ).reverse();

      const paymentTrendData = lastSixMonths.map(month => {
        const monthPayments = paymentsData.data?.payments?.filter(payment => 
          moment(payment.createdAt).format('MMM YYYY') === month
        ) || [];
        return monthPayments.length;
      });

      // Process user growth (last 6 months)
      const userGrowthData = lastSixMonths.map(month => {
        const monthUsers = usersData.data?.filter(user => 
          moment(user.createdAt).format('MMM YYYY') === month
        ) || [];
        return monthUsers.length;
      });

      setStats({
        totalUsers: usersData.data?.length || 0,
        totalProducts: productsData.data?.length || 0,
        totalPayments: paymentsData.data?.total || 0,
        successfulPayments: paymentsData.data?.successfulPayments || 0,
        pendingPayments: paymentsData.data?.pendingPayments || 0,
        failedPayments: paymentsData.data?.failedPayments || 0,
        approvedPayments: paymentsData.data?.approvedPayments || 0,
        totalRevenue: paymentsData.data?.totalRevenue || 0,
      });

      setPaymentTrend(paymentTrendData);
      setUserGrowth(userGrowthData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Payment Status Pie Chart Data
  const paymentStatusData = {
    labels: ['Successful', 'Pending', 'Failed', 'Approved'],
    datasets: [{
      data: [
        stats.successfulPayments,
        stats.pendingPayments,
        stats.failedPayments,
        stats.approvedPayments
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1,
    }]
  };

  // Payment Trend Bar Chart Data
  const paymentTrendData = {
    labels: Array.from({ length: 6 }, (_, i) => 
      moment().subtract(i, 'months').format('MMM YYYY')
    ).reverse(),
    datasets: [{
      label: 'Payments',
      data: paymentTrend,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  // User Growth Bar Chart Data
  const userGrowthData = {
    labels: Array.from({ length: 6 }, (_, i) => 
      moment().subtract(i, 'months').format('MMM YYYY')
    ).reverse(),
    datasets: [{
      label: 'New Users',
      data: userGrowth,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<GiMoneyStack className="text-yellow-500" />}
              valueStyle={{ color: '#f59e0b' }}
              formatter={(value) => `${value.toLocaleString('en-IN')} Birr`}
            />
          </Card>
        </Col>
        
      </Row>

      {/* Payment Status Cards */}
      <Row gutter={[16, 16]} className="mb-6">
       
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Pending Payments"
              value={stats.pendingPayments}
              prefix={<SyncOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Failed Payments"
              value={stats.failedPayments}
              prefix={<CloseCircleOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Approved Payments"
              value={stats.approvedPayments}
              prefix={<CheckCircleOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Payment Status Distribution" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="h-64">
              <Pie 
                data={paymentStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { backgroundColor: '#1f2937' }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Payment Trend (Last 6 Months)" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="h-64">
              <Bar
                data={paymentTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { backgroundColor: '#1f2937' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of Payments' }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="User Growth (Last 6 Months)" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="h-64">
              <Bar
                data={userGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { backgroundColor: '#1f2937' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of New Users' }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;