import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Avatar from './components/Avatar';
import Redeem from './components/Redeem';
import Building from './components/Building';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/building/:id" element={<Building />} />
      </Routes>
    </div>
  );
}

export default App; 