import Notes from './Notes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tetris from './Tetris';
import PalletGenerator from './PalletGenerator';
import Options from './Options';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Options />} />
        <Route path='/tetris' element={<Tetris />} />
        <Route path='/PalletGenerator' element={<PalletGenerator />} />
        <Route path='/notes' element={<Notes />} />
      </Routes>
    </Router>
  );
}
