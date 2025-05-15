import PalleteGenerator from "./PalletGenerator";
import Notes from "./Notes";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router";
import Header from "./Header";

function Options() {
	return <div id='utils-root' >
		<Header name="Utils" />
		<div id='utils'>
			<Link id='PalletGenerator' className='util' to="/pallet-generator">
				Pallet Generator
			</Link>
			<Link id='Notes' className='util' to="/notes"> Notes </Link>
			<Link id='Notes' className='util' to="/notes"> Vim Golf </Link>
		</div>
	</div>;
}
export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Options />} />
				<Route path="/pallet-generator" element={<PalleteGenerator />} />
				<Route path="/notes" element={<Notes />} />
			</Routes>
		</Router>
	);
}
