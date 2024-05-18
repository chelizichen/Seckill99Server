import  { useEffect } from 'react';
import { Typography,notification } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';



const Seckill = () => {
  const { hashKey } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message:string) => {
    api.info({
      message: `Notification`,
      description: <div>{message}</div>,
      placement:"topRight",
    });
  };
  
  useEffect(() => {
    fetchSeckillActivity(hashKey);
  }, [hashKey]);

  const fetchSeckillActivity = async (hashKey) => {
    try {
      const response = await axios.post('/seckill99server/seckill', { hashKey: hashKey,userHash:"123124nkasd",userBuyTime:moment().format("YYYY-MM-DD HH:mm:ss") });
      if (response.data.error) {
        openNotification('Failed to fetch seckill activity: ' + response.data.error);
      } 
      if(response.status == 200){
        openNotification('Successfully fetched seckill activity');
      }
    } catch (error) {
      openNotification('Failed to fetch seckill activity: ' + error.response.data.error);
    }
  };

  return (
    <div>
      {contextHolder}
        <Typography.Paragraph>Loading...</Typography.Paragraph>
    </div>
  );
};

export default Seckill;