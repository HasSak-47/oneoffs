import { ChangeEventHandler, useState } from 'react';
import { oklab_to_rgb, oklch_to_oklab, rgb_to_hex } from './color';
import Header from './Header';

function ColorPicker() {
	const [L, setl] = useState(0.8);
	const [c, setc] = useState(0.3);
	const [h, seth] = useState(0);

	const fmt = (
		beg_l: number,
		beg_c: number,
		beg_h: number,
		end_l: number,
		end_c: number,
		end_h: number
	) => {
		return `linear-gradient(to right, oklch(${beg_l} ${beg_c} ${beg_h * 360}deg), oklch(${end_l} ${end_c} ${end_h * 360}deg) )`;
	};

	const gradient_maker = () => {
		let data = '';
		for (let i = 0; i < 16; ++i) {
			let deg = Math.floor((i / 16) * 360);
			data += `oklch(${L} ${c} ${deg}deg),`;
		}
		data += `oklch(${L} ${c} 360deg)`;

		return data;
	};

	const sliderMaker = (
		def: number,
		bg_image: string,
		on: ChangeEventHandler<HTMLInputElement>
	) => {
		return (
			<div className='color-picker-slider'>
				{' '}
				<input
					className='color-picker-slider-slider'
					type='range'
					max='1000'
					min='0'
					step='1'
					defaultValue={def * 1000}
					style={{
						backgroundImage: bg_image,
					}}
					onChange={on}
				/>
				<div className='color-picker-slider-text'>{def} %</div>
			</div>
		);
	};

	const bg_rainbow = `linear-gradient(to right, ${gradient_maker()})`;
	const OkL = sliderMaker(L, fmt(0, c, h, 1, c, h), (e) =>
		setl(parseInt(e.target.value) / 1000)
	);
	const Okc = sliderMaker(c, fmt(L, 0, h, L, 1, h), (e) =>
		setc(parseInt(e.target.value) / 1000)
	);
	const Okh = sliderMaker(h, bg_rainbow, (e) =>
		seth(parseInt(e.target.value) / 1000)
	);

	console.log(L, c, h);

	return (
		<div className='color-picker'>
			<button
				className='color-picker-square'
				style={{ backgroundImage: fmt(L, c, h, L, c, h) }}
				onClick={(_) => {
					const rgb = oklab_to_rgb(oklch_to_oklab({ L, c, h }));
					navigator.clipboard.writeText(rgb_to_hex(rgb));
				}}
			/>
			<div className='color-picker-sliders'>
				{OkL}
				{Okc}
				{Okh}
			</div>
		</div>
	);
}

function getPolygonPoints(n, radius, centerX, centerY) {
	const angleStep = (2 * Math.PI) / n;
	const points = [];
	for (let i = 0; i < n; i++) {
		const angle = i * angleStep - Math.PI / 2; // rotate to start from top
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		points.push([x, y]);

		return points;


		function ColoredPolygon({ n = 6, size = 300, edgeColors = [] }) {
			const center = size / 2;
			const radius = center * 0.8;
			const points = getPolygonPoints(n, radius, center, center);

			// Extend edgeColors to match number of edges
			const colors = Array.from(
				{ length: n },
				(_, i) => edgeColors[i % edgeColors.length]
			);

			const polygonId = `polygon-gradient-${n}`;

			rn(
				width = { size } height = { size } viewBox = {`0 0 ${size} ${size}`}>
					s >
					ialGradient id = { polygonId } cx = '50%' cy = '50%' r = '50%' >
					{
						colors.map((color, i) => (
							<stop
								key={i}
								offset={`${(i / (n - 1)) * 100}%`}
								stopColor={color}
							/>
						))
					}
				</radialGradient >
			defs >

			{/* Fill with radial gradient */ }
			< polygon
		points = { points.map((p) => p.join(',')).join(' ') }
		fill = {`url(#${polygonId})`
	}
	stroke = 'none'
					
						
						dividual edge strokes */
}
s.map((start, i) => {
						t end = points[(i + 1) % n];
	rn(
		ine
						key = { i }
					  x1 = { start[0]}
				    y1 = { start[1]}
			      x2 = { end[0]}
		        y2 = { end[1]}
	          stroke = { colors[i]}
            strokeWidth = { 3}
		/>
        );
})}
    </svg >
  );
}

export default ColoredPolygon;
export default function PalletGenerator() {
	return (
		<div id='pallet-generator' className='h-full w-full'>
			<div id='pallet-config' className='m-auto mt-10 w-fit'>
				<label className='text-oldWhite'> edges: </label>
				<input className='text-oldWhite text-right' type='number' />
			</div>
			<div id='pallet-polygon' className='m-auto mt-10 w-fit'>
				<label className='text-oldWhite'> edges: </label>
				<input className='text-oldWhite text-right' type='number' />
			</div>
		</div>
	);
}
