import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Tag, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Card, 
  Statistic,
  Modal,
  Descriptions,
  Divider,
  message
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TransactionOutlined
} from '@ant-design/icons'
import moment from 'moment'
import displayINRCurrency from '../helpers/displayCurrency'
import SummaryApi from '../common'

const { RangePicker } = DatePicker
const { Option } = Select

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: []
  })
  const [stats, setStats] = useState({
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    approvedPayments: 0,
    totalRevenue: 0
  })
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approveModalVisible, setApproveModalVisible] = useState(false);
const [paymentToApprove, setPaymentToApprove] = useState(null);


  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { current, pageSize } = pagination
      const { search, status, dateRange } = filters
      
      let url = `${SummaryApi.getAllPayments.url}?page=${current}&limit=${pageSize}`
      
      if (search) url += `&search=${search}`
      if (status) url += `&status=${status}`
      if (dateRange.length === 2) {
        url += `&startDate=${dateRange[0].toISOString()}&endDate=${dateRange[1].toISOString()}`
      }
      
      const response = await fetch(url, {
        method: SummaryApi.getAllPayments.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPayments(data.data.payments)
        setPagination({
          ...pagination,
          total: data.data.total
        })
        
        if (current === 1 && !search && !status && dateRange.length === 0) {
          setStats({
            totalPayments: data.data.total,
            successfulPayments: data.data.successfulPayments,
            pendingPayments: data.data.pendingPayments,
            failedPayments: data.data.failedPayments,
            approvedPayments: data.data.approvedPayments,
            totalRevenue: data.data.totalRevenue
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [pagination.current, filters])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value })
    setPagination({ ...pagination, current: 1 })
  }

  const handleStatusFilter = (value) => {
    setFilters({ ...filters, status: value })
    setPagination({ ...pagination, current: 1 })
  }

  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates })
    setPagination({ ...pagination, current: 1 })
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: []
    })
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    })
  }

  const handleViewDetails = (record) => {
    setSelectedPayment(record)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedPayment(null)
  }

  const handleExport = () => {
    // Implement export logic
    console.log('Export data')
  }

  const showApproveModal = (paymentId) => {
  setPaymentToApprove(paymentId);
  setApproveModalVisible(true);
};

const handleApproveConfirm = async () => {
  await handleApprovePayment(paymentToApprove);
  setApproveModalVisible(false);
};

// Add the approve handler
const handleApprovePayment = async (paymentId) => {
  try {
    const response = await fetch(`${SummaryApi.approvePayment.url}/${paymentId}`, {
      method: SummaryApi.approvePayment.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      message.success('Payment approved successfully');
      fetchPayments(); // Refresh the data
    } else {
      message.error(data.message || 'Failed to approve payment');
    }
  } catch (error) {
    console.error('Approve payment error:', error);
    message.error('Failed to approve payment');
  }
};

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'tx_ref',
      key: 'tx_ref',
      render: (text) => <span className="font-mono">{text}</span>
    },
    {
      title: 'User',
      dataIndex: 'user_id',
      key: 'user',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.user_id?.firstName || 'N/A'}</div>
          <div className="font-medium">{record.user_id?.lastName || 'N/A'}</div>
          <div className="text-gray-500 text-sm">{record.user_id?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Product',
      dataIndex: 'product_id',
      key: 'product',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.product_id?.productName || 'N/A'}</div>
          <div className="text-gray-500 text-sm">
            {displayINRCurrency(record.product_id?.sellingPrice || 0)} × {record.quantity || 1}
          </div>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => displayINRCurrency(amount),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => moment(date).format('DD MMM YYYY, hh:mm A'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  render: (status) => {
    let color = '';
    let icon = null;
    
    switch (status) {
      case 'success':
        color = 'green';
        icon = <CheckCircleOutlined />;
        break;
      case 'pending':
        color = 'orange';
        icon = <SyncOutlined spin />;
        break;
      case 'failed':
        color = 'red';
        icon = <CloseCircleOutlined />;
        break;
      case 'approved':
        color = 'blue';
        icon = <CheckCircleOutlined />;
        break;
      default:
        color = 'gray';
    }
    
    return (
      <Tag color={color} icon={icon}>
        {status.toUpperCase()}
      </Tag>
    );
  },
  filters: [
    { text: 'Success', value: 'success' },
    { text: 'Pending', value: 'pending' },
    { text: 'Failed', value: 'failed' },
    { text: 'Approved', value: 'approved' }
  ],
  onFilter: (value, record) => record.status === value
},

// Update your action column to show approve button for pending payments
{
  title: 'Action',
  key: 'action',
  render: (_, record) => (
    <Space size="middle">
      <Button 
        size="small" 
        onClick={() => handleViewDetails(record)}
        icon={<InfoCircleOutlined />}
      >
        Details
      </Button>
      {record.status === 'pending' && (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => showApproveModal(record._id)}
          icon={<CheckCircleOutlined />}
        >
          Approve
        </Button>
      )}
    </Space>
  )
}
  ]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Payments</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <Statistic 
            title="Total Payments" 
            value={stats.totalPayments} 
            prefix={<DollarOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Successful" 
            value={stats.successfulPayments} 
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Pending" 
            value={stats.pendingPayments} 
            valueStyle={{ color: '#faad14' }}
            prefix={<SyncOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Failed" 
            value={stats.failedPayments} 
            valueStyle={{ color: '#cf1322' }}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Total Revenue" 
            value={displayINRCurrency(stats.totalRevenue)} 
            prefix={<DollarOutlined />}
          />
        </Card>
        <Card>
    <Statistic 
      title="Approved" 
      value={stats.approvedPayments} 
      valueStyle={{ color: '#1890ff' }}
      prefix={<CheckCircleOutlined />}
    />
  </Card>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by transaction ID or user"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            className="flex-1"
          />
          
          <Select
            placeholder="Filter by status"
            allowClear
            value={filters.status}
            onChange={handleStatusFilter}
            className="w-full md:w-40"
          >
            <Option value="success">Success</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
          </Select>
          
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            onChange={handleDateChange}
            value={filters.dateRange}
            className="w-full md:w-64"
          />
          
          <Button 
            icon={<FilterOutlined />} 
            onClick={resetFilters}
          >
            Reset
          </Button>
          
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Payments Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </div>

      {/* Payment Details Modal */}
      <Modal
        title="Payment Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedPayment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Transaction ID">
              <Tag icon={<TransactionOutlined />} color="blue">
                {selectedPayment.tx_ref}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="User Information">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-gray-500" />
                <div>
                  <div className="font-medium">{selectedPayment.user_id?.firstName || 'N/A'}</div>
                  <div className="font-medium">{selectedPayment.user_id?.lastName || 'N/A'}</div>
                  <div className="text-gray-500">{selectedPayment.user_id?.email || 'N/A'}</div>
                </div>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Product Information">
              <div className="flex items-center gap-2">
                <ShoppingOutlined className="text-gray-500" />
                <div>
                  <div className="font-medium">{selectedPayment.product_id?.productName || 'N/A'}</div>
                  <div className="text-gray-500">
                    Price: {displayINRCurrency(selectedPayment.product_id?.sellingPrice || 0)}
                  </div>
                  <div className="text-gray-500">Quantity: {selectedPayment.quantity || 1}</div>
                </div>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Amount">
              {displayINRCurrency(selectedPayment.amount)}
            </Descriptions.Item>

            <Descriptions.Item label="Payment Type">
              {selectedPayment.type || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag 
                color={
                  selectedPayment.status === 'success' ? 'green' : 
                  selectedPayment.status === 'pending' ? 'orange' : 'red'
                }
                icon={
                  selectedPayment.status === 'success' ? <CheckCircleOutlined /> :
                  selectedPayment.status === 'pending' ? <SyncOutlined spin /> : <CloseCircleOutlined />
                }
              >
                {selectedPayment.status?.toUpperCase() || 'N/A'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Date">
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-gray-500" />
                {moment(selectedPayment.createdAt).format('DD MMM YYYY, hh:mm A')}
              </div>
            </Descriptions.Item>

            {selectedPayment.updatedAt && (
              <Descriptions.Item label="Last Updated">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-gray-500" />
                  {moment(selectedPayment.updatedAt).format('DD MMM YYYY, hh:mm A')}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
      <Modal
  title="Confirm Approval"
  visible={approveModalVisible}
  onOk={handleApproveConfirm}
  onCancel={() => setApproveModalVisible(false)}
>
  <p>Are you sure you want to approve this payment?</p>
</Modal>
    </div>
  )
}

export default AdminPayments