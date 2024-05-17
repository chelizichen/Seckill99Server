import React, { useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Seckill = () => {
  const [activity, setActivity] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const { hashKey } = useParams();

  useEffect(() => {
    fetchSeckillActivity(hashKey);
  }, [hashKey]);

  const fetchSeckillActivity = async (hashKey) => {
    try {
      const response = await axios.post('/api/seckill', { seckill_hash_key: hashKey });
      if (response.data.error) {
        alert('Failed to fetch seckill activity: ' + response.data.error);
      } else {
        setActivity(response.data);
        setIsAvailable(response.data.seckill_count > 0 && !response.data.error);
      }
    } catch (error) {
      alert('Failed to fetch seckill activity: ' + error.message);
    }
  };

  const handlePurchase = async () => {
    // Implement the seckill purchase logic here
    alert('Purchase logic not implemented yet!');
  };

  return (
    <div>
      {activity ? (
        <>
          <Typography.Title level={2}>{activity.seckill_description}</Typography.Title>
          {isAvailable ? (
            <Button type="primary" onClick={handlePurchase}>
              Purchase Now
            </Button>
          ) : (
            <Typography.Paragraph>
              Sorry, the item is not available for purchase.
            </Typography.Paragraph>
          )}
        </>
      ) : (
        <Typography.Paragraph>Loading...</Typography.Paragraph>
      )}
    </div>
  );
};

export default Seckill;