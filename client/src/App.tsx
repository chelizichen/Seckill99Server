import { Route, Routes,Navigate } from 'react-router-dom';

import SetSeckillKey from "./views/setSeckillKey";
import Seckill from "./views/seckill";
import Welcome from './views/f32home';
import SeckillList from './views/seckillList';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/f32home" replace={true}/>} />
        <Route path="/f32home" element={<Welcome ></Welcome>} />
        <Route
          path="/set-seckill-key"
          element={<SetSeckillKey></SetSeckillKey>}
        />
        <Route path="/seckill/:hashKey" element={<Seckill></Seckill>} />
        <Route path="/seckill-list" element={<SeckillList/>} />
      </Routes>
  );
}

export default App;
