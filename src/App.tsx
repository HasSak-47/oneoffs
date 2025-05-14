import PalleteGenerator from "./PalletGenerator";
import Notes from "./Notes";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router";

function Options() {
	return (
		<div id='utils' className='w-fit bg-sumiInk1 rounded-xl'>
			<div id='Pallet Generator' className='util'>
				<Link to="/pallet-generator">
					<button>Pallet Generator</button>
				</Link>
			</div>
			<div id='Notes' className='util'>
				<Link to="/notes">
					<button>Notes</button>
				</Link>
			</div>
		</div>
	);
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
