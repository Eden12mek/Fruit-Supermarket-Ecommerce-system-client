import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { 
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ManagerDashboard = () => {
  const user = useSelector(state => state?.user?.user);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStockValue: 0,
    lowStockProducts: 0,
    totalProductSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await fetch(SummaryApi.allProduct.url, {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
      });
      const productsData = await productsResponse.json();

      // Fetch payments for sales data
      const paymentsResponse = await fetch(SummaryApi.getAllPayments.url, {
        method: SummaryApi.getAllPayments.method,
        credentials: 'include',
      });
      const paymentsData = await paymentsResponse.json();

      // Calculate statistics
      const products = productsData?.data || [];
      const payments = paymentsData?.data?.payments || [];

      // Category distribution
      const categories = [...new Set(products.map(product => product.category))];
      const categoryCounts = categories.map(category => ({
        name: category,
        count: products.filter(p => p.category === category).length,
      }));

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

      // Calculate total stock value and low stock products
      const totalStockValue = products.reduce((sum, product) => 
        sum + (product.sellingPrice * (product.quantity || 0)), 0
      );
      const lowStockProducts = products.filter(product => 
        (product.quantity || 0) < 10
      ).length;

      // Calculate total product sales
      const totalProductSales = payments
        .filter(payment => payment.status === 'success' || payment.status === 'approved')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalStockValue,
        lowStockProducts,
        totalProductSales,
      });

      setCategoryDistribution(categoryCounts);
      setSalesTrend(salesTrendData);
    } catch (error) {
      console.error('Failed to fetch manager dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Category Distribution Pie Chart Data
  const categoryDistributionData = {
    labels: categoryDistribution.map(cat => cat.name),
    datasets: [{
      data: categoryDistribution.map(cat => cat.count),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Sales Trend Bar Chart Data
  const salesTrendData = {
    labels: Array.from({ length: 6 }, (_, i) => 
      moment().subtract(i, 'months').format('MMM YYYY')
    ).reverse(),
    datasets: [{
      label: 'Sales (INR)',
      data: salesTrend,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manager Dashboard</h1>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingCartOutlined className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Categories"
              value={stats.totalCategories}
              prefix={<TagsOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Stock Value"
              value={stats.totalStockValue}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
              formatter={(value) => displayINRCurrency(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Low Stock Products"
              value={stats.lowStockProducts}
              prefix={<BarChartOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Sales"
              value={stats.totalProductSales}
              prefix={<DollarOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#f59e0b' }}
              formatter={(value) => displayINRCurrency(value)}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Product Category Distribution" 
            className="shadow-md"
            headStyle={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="h-64">
              <Pie 
                data={categoryDistributionData}
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
              <Bar
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
      </Row>
    </div>
  );
};

export default ManagerDashboard;