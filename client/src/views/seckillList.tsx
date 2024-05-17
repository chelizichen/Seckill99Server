import React, { useEffect, useState } from 'react';
import { Table, Typography, } from 'antd';
import axios from 'axios';
import "../css/index.css"
import moment from 'moment';
const columns = [
  {
    title: '商品名称',
    dataIndex: 'seckillDescription',
  },
  {
    title: '数量',
    dataIndex: 'seckillCount',
    render: (value) => <Typography.Text type="secondary">{value}</Typography.Text>,
  },
  {
    title: '开始时间',
    dataIndex: 'couldBuyTime',
    render: (value) => <Typography.Text>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</Typography.Text>,
  },
  {
    title: '操作',
    dataIndex: '',
    render: (value, record) => (
      <a href={`/seckill/${record.hashKey}`}>
        秒杀
      </a>
    ),
  },
];

const SeckillList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/getSeckillList');
      if (response.data.error) {
        console.error('Error fetching seckill list:', response.data.error);
        return;
      }
      setData(response.data);
    } catch (error) {
      console.error('Error fetching seckill list:', error);
    }
  };

  return (
    <div className="seckill-list-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '暂无商品' }}
      />
    </div>
  );
};

export default SeckillList;