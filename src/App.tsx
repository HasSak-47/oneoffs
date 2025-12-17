import Notes from './Notes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PalletGenerator from './PalletGenerator';
import Options from './Options';
import Blog, { BlogHome, BlogPost } from './Blog';

export default function App() {
	return (
		<BrowserRouter basename='/oneoffs'>
			<Routes>
				<Route path='/' element={<Options />} />
				<Route path='/blog' element={<Blog />}>
					<Route index element={<BlogHome />} />
					<Route path=':slug' element={<BlogPost />} />
				</Route>
				<Route path='/PalletGenerator' element={<PalletGenerator />} />
				<Route path='/notes' element={<Notes />} />
			</Routes>
		</BrowserRouter>
	);
}
