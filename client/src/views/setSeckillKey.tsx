import { Form, Input, DatePicker, Button, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SetSeckillKey = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message: string) => {
    api.info({
      message: `Notification`,
      description: message,
      placement: "topRight",
    });
  };

  const nag = useNavigate();

  const onFinish = async (values) => {
    try {
      values.seckillCount = Number(values.seckillCount);
      const response = await axios.post("/seckill99server/setSeckillKey", values);
      if (response.data.error) {
        openNotification("Failed to create seckill activity: " + response.data.error);
      } else {
        openNotification("Seckill activity created successfully!");
        nag("/seckill-list");
      }
    } catch (error) {
      openNotification("Failed to create seckill activity: " + error.message);
    }
  };

  return (
    <div>
      {contextHolder}
      <h1>Create Seckill Activity</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Description"
          name="seckillDescription"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="HashKey"
          name="hashKey"
          rules={[{ required: true, message: "Please enter a hashKey!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Start Time (UTC)"
          name="couldBuyTime"
          rules={[{ required: true, message: "Please select a start time!" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label="Seckill Count"
          name="seckillCount"
          rules={[
            { required: true, message: "Please enter inventory amount!" },
          ]}
        >
          <Input type="number" min="1" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SetSeckillKey;
