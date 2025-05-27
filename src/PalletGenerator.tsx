import { ChangeEventHandler, useState } from 'react';
import { oklab_to_rgb, oklch_to_oklab, rgb_to_hex } from './color';
import Header from './Header';

interface ColorProps {
  L: number;
  c: number;
  h: number;
  setl: (v: number) => void;
  setc: (v: number) => void;
  seth: (v: number) => void;
}

// @ts-ignore
function ColorPicker({ L, c, h, setl, setc, seth }: ColorProps) {
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
      <div className='flex items-center gap-2'>
        <input
          className='min-w-0 flex-1 appearance-none rounded-xl'
          type='range'
          max='1000'
          min='0'
          step='1'
          value={def * 1000}
          style={{
            backgroundImage: bg_image,
          }}
          onChange={on}
        />
        <div className='text-oldWhite w-8 text-right whitespace-nowrap'>
          {Math.round(def * 100)} %
        </div>
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

  return (
    <div className='max-w-[200px] md:max-w-[400px]'>
      <button
        className='aspect-square w-full rounded-xl hover:scale-110 hover:cursor-copy'
        style={{ backgroundImage: fmt(L, c, h, L, c, h) }}
        onClick={(_) => {
          const rgb = oklab_to_rgb(oklch_to_oklab({ L, c, h }));
          navigator.clipboard.writeText(rgb_to_hex(rgb));
        }}
      />
      <div className='w-full'>
        {OkL}
        {Okc}
        {Okh}
      </div>
    </div>
  );
}
export default function PalletGenerator() {
  const [startL, setStartL] = useState(0.6);
  const [startc, setStartc] = useState(0.07);
  const [starth, setStarth] = useState(0.3);
  const [endL, setEndL] = useState(0.6);
  const [endc, setEndc] = useState(0.7);
  const [endh, setEndh] = useState(0.3);

  const [number, setNumber] = useState(2);
  const [numberInput, setNumberInput] = useState('2');

  const setGlobalNumber = (n: number) => {
    setNumberInput(n.toString());
    setNumber(n);
  };

  const commit = () => {
    const parsed = parseInt(numberInput, 10);
    const clamped = isNaN(parsed) ? 2 : Math.min(Math.max(parsed, 2), 10);
    setGlobalNumber(clamped);
  };

  return (
    <div id='pallet-generator' className='h-full w-full'>
      <Header name='Pallet Generator' ret={true} />
      <div className='m-auto mt-10 flex w-fit flex-col space-y-4 space-x-4 md:flex-row'>
        <ColorPicker
          L={startL}
          c={starth}
          h={startc}
          setl={setStartL}
          setc={setStarth}
          seth={setStartc}
        />

        <ColorPicker
          L={endL}
          c={endh}
          h={endc}
          setl={setEndL}
          setc={setEndh}
          seth={setEndc}
        />
      </div>
      <div className='m-auto mt-6 w-fit'>
        <div className='bg-sumiInk4 flex w-fit items-center gap-2 rounded-xl p-2 text-white'>
          <button
            className='rounded px-3 text-lg font-bold hover:cursor-pointer'
            onClick={(_) => {
              setGlobalNumber(Math.max(number - 1, 2));
            }}
          >
            –
          </button>
          <input
            className='w-16 [appearance:textfield] bg-transparent text-center text-lg outline-none'
            value={numberInput}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setNumberInput(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
            }}
            onBlur={commit}
          />
          <button
            className='rounded px-3 text-lg font-bold hover:cursor-pointer'
            onClick={(_) => {
              setGlobalNumber(Math.min(number + 1, 10));
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
