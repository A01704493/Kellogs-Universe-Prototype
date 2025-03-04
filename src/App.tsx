import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Avatar from './components/Avatar';
import Redeem from './components/Redeem';
import Building from './components/Building';
import GameCanvas from './components/GameCanvas';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/building/:id" element={<Building />} />
        <Route path="/games/zucaritas" element={<GameCanvas />} />
        <Route path="/games/choco-krispis" element={<GameCanvas />} />
        <Route path="/games/froot-loops" element={<GameCanvas />} />
      </Routes>
    </div>
  );
}

export default App; 