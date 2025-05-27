import Notes from './Notes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tetris from './Tetris';
import PalletGenerator from './PalletGenerator';
import Options from './Options';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/oneoffs/' element={<Options />} />
        <Route path='/oneoffs/tetris' element={<Tetris />} />
        <Route path='/oneoffs/PalletGenerator' element={<PalletGenerator />} />
        <Route path='/oneoffs/notes' element={<Notes />} />
      </Routes>
    </Router>
  );
}
