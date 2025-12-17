import Notes from './Notes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tetris from './Tetris';
import PalletGenerator from './PalletGenerator';
import Options from './Options';
import Blog, { BlogHome, BlogPost } from './Blog';
import Crypto from './Crypto';

export default function App() {
  return (
    <BrowserRouter basename='/oneoffs'>
      <Routes>
        <Route path='/' element={<Options />} />
        <Route path='/tetris' element={<Tetris />} />
        <Route path='/blog' element={<Blog />}>
          <Route index element={<BlogHome />} />
          <Route path=':slug' element={<BlogPost />} />
        </Route>
        <Route path='/PalletGenerator' element={<PalletGenerator />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/crypto' element={<Crypto />} />
      </Routes>
    </BrowserRouter>
  );
}
