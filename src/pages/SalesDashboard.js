import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Row, Col, Spin, List, Avatar } from 'antd';
import { 
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

const SalesDashboard = () => {
  const user = useSelector(state => state?.user?.user);
  const messages = useSelector(state => state?.message?.messages || []);
  const [stats, setStats] = useState({
    totalSales: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    topProducts: [],
    recentMessages: [],
  });
  const [loading, setLoading] = useState(true);
  const [paymentStatusDistribution, setPaymentStatusDistribution] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch payments
      const paymentsResponse = await fetch(SummaryApi.getAllPayments.url, {
        method: SummaryApi.getAllPayments.method,
        credentials: 'include',
      });
      const paymentsData = await paymentsResponse.json();

      // Fetch products
      const productsResponse = await fetch(SummaryApi.allProduct.url, {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
      });
      const productsData = await productsResponse.json();

      // Process data
      const payments = paymentsData?.data?.payments || [];
      const products = productsData?.data || [];

      // Calculate total sales and payment statuses
      const successfulPayments = payments.filter(p => p.status === 'success' || p.status === 'approved').length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;
      const totalSales = payments
        .filter(p => p.status === 'success' || p.status === 'approved')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      // Top products by sales (based on payment data)
      const productSales = payments
        .filter(p => p.status === 'success' || p.status === 'approved')
        .reduce((acc, payment) => {
          const productId = payment.product_id?._id;
          if (productId) {
            acc[productId] = acc[productId] || { name: payment.product_id?.productName, sales: 0 };
            acc[productId].sales += payment.amount;
          }
          return acc;
        }, {});
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // Payment status distribution
      const statusCounts = {
        success: successfulPayments,
        pending: pendingPayments,
        failed: payments.filter(p => p.status === 'failed').length,
        approved: payments.filter(p => p.status === 'approved').length,
      };

      // Sales trend (last 6 months)
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => 
        moment().subtract(i, 'months').format('MMM YYYY')
      ).reverse();

      const salesTrendData = lastSixMonths.map(month => {
        const monthPayments = payments.filter(payment => 
          moment(payment.createdAt).format('MMM YYYY') === month &&
          (payment.status === 'success' || payment.status === 'approved')
        );
        return monthPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      });

      // Recent messages (limited to 5)
      const recentMessages = messages.slice(0, 5).map(msg => ({
        id: msg._id,
        name: msg.name,
        subject: msg.subject,
        createdAt: moment(msg.createdAt).fromNow(),
      }));

      setStats({
        totalSales,
        successfulPayments,
        pendingPayments,
        topProducts,
        recentMessages,
      });

      setPaymentStatusDistribution(statusCounts);
      setSalesTrend(salesTrendData);
    } catch (error) {
      console.error('Failed to fetch sales dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Payment Status Pie Chart Data
  const paymentStatusData = {
    labels: ['Success', 'Pending', 'Failed', 'Approved'],
    datasets: [{
      data: [
        paymentStatusDistribution.success || 0,
        paymentStatusDistribution.pending || 0,
        paymentStatusDistribution.failed || 0,
        paymentStatusDistribution.approved || 0,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Sales Trend Line Chart Data
  const salesTrendData = {
    labels: Array.from({ length: 6 }, (_, i) => 
      moment().subtract(i, 'months').format('MMM YYYY')
    ).reverse(),
    datasets: [{
      label: 'Sales (INR)',
      data: salesTrend,
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    }],
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Sales Dashboard</h1>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Sales"
              value={stats.totalSales}
              prefix={<DollarOutlined className="text-emerald-500" />}
              valueStyle={{ color: '#00a78f' }}
              formatter={(value) => displayINRCurrency(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Successful Payments"
              value={stats.successfulPayments}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Pending Payments"
              value={stats.pendingPayments}
              prefix={<SyncOutlined className="text-orange-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Lists */}
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
                    tooltip: { backgroundColor: '#1f2937' },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Sales Trend (Last 6 Months)" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="h-64">
              <Line
                data={salesTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { backgroundColor: '#1f2937' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Sales Amount (INR)' },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Top Performing Products" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={stats.topProducts}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingCartOutlined />} style={{ backgroundColor: '#00a78f' }} />}
                    title={item.name}
                    description={`Total Sales: ${displayINRCurrency(item.sales)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Customer Messages" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={stats.recentMessages}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<MessageOutlined />} style={{ backgroundColor: '#00a78f' }} />}
                    title={item.name}
                    description={
                      <>
                        <div>{item.subject}</div>
                        <div className="text-gray-500 text-sm">{item.createdAt}</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesDashboard;