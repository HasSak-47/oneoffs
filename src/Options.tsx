import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function Options() {
	const links = ['notes', 'PalletGenerator', 'tetris'];
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

	useEffect(() => {
		if (focusedIndex === null) {
			return;
		}
		if (linkRefs.current[focusedIndex]) {
			linkRefs.current[focusedIndex]?.focus();
		}
	}, [focusedIndex]);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		const move = (delta: number, def: number) => {
			return (prev: number | null) => {
				console.log(prev);
				if (prev === null) {
					return def;
				} else {
					let next = prev + delta;
					if (next < 0) {
						next += links.length;
					}

					return next % links.length;
				}
			};
		};
		console.log(e.key);
		if (e.key === 'ArrowDown' || e.key === 'j') {
			e.preventDefault();
			setFocusedIndex(move(1, 0));
		} else if (e.key === 'ArrowUp' || e.key === 'k') {
			e.preventDefault();
			setFocusedIndex(move(-1, links.length - 1));
		}
	};

	const formatLabel = (link: string) =>
		link
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (s) => s.toUpperCase())
			.trim();

	return (
		<div
			id='utils-root'
			onKeyDown={handleKeyDown}
			onLoad={(e) => {
				console.log(e.currentTarget);
				e.currentTarget.focus();
			}}
			tabIndex={0}
		>
			<Header name='Utils' />
			<div id='utils'>
				{links.map((link, index) => (
					<Link
						key={link}
						id={link}
						className='util'
						to={`/${link}`}
						ref={(el) => {
							linkRefs.current[index] = el;
						}}
						tabIndex={-1}
						onMouseOver={(_) => {
							setFocusedIndex(index);
						}}
						onMouseLeave={(_) => {
							if (focusedIndex !== null)
								linkRefs.current[focusedIndex]?.focus();
							setFocusedIndex(null);
						}}
					>
						{formatLabel(link)}
					</Link>
				))}
			</div>
		</div>
	);
}

export default Options;
