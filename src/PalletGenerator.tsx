import { ChangeEventHandler, useState } from 'react';
import { oklab_to_rgb, oklch_to_oklab, rgb_to_hex } from './color';
import Header from './Header';

export default function PalletGenerator() {
	return (
		<div>
			<Header name='Pallet Generator' ret={true} />
		</div>
	);
}
