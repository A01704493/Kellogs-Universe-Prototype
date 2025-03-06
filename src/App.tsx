import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Avatar from './components/Avatar';
import Redeem from './components/Redeem';
import Building from './components/Building';
import SimpleGame from './components/SimpleGame';
import ProgressUI from './components/ProgressUI';
import RedeemCodeUI from './components/RedeemCodeUI';

function App() {
  return (
    <div className="app full-viewport">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/dashboard" element={<ProgressUI />} />
        <Route path="/redeem-code" element={<RedeemCodeUI />} />
        <Route path="/minigames/zucaritas" element={<SimpleGame gameType="zucaritas" />} />
        <Route path="/minigames/choco-krispis" element={<SimpleGame gameType="choco-krispis" />} />
        <Route path="/minigames/froot-loops" element={<SimpleGame gameType="froot-loops" />} />
        <Route path="/games/:id" element={<Building />} />
      </Routes>
    </div>
  );
}

export default App; 