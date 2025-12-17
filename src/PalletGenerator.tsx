import { ChangeEventHandler, useState } from 'react';
import { color_step, oklab_to_rgb, oklch_to_oklab, rgb_to_hex } from './color';
import Header from './Header';

interface ColorProps {
  L: number;
  c: number;
  h: number;
  setl: (v: number) => void;
  setc: (v: number) => void;
  seth: (v: number) => void;
}

function fmt(
  beg_l: number,
  beg_c: number,
  beg_h: number,
  end_l: number,
  end_c: number,
  end_h: number
) {
  const col = `linear-gradient(to right, oklch(${beg_l} ${beg_c} ${beg_h * 360}deg), oklch(${end_l} ${end_c} ${end_h * 360}deg) )`;
  return col;
}

function ColorPicker({ L, c, h, setl, setc, seth }: ColorProps) {
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
          className='hover:scae-105 min-w-0 flex-1 appearance-none rounded-xl'
          aria-label='Color Slider'
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
        className='aspect-square w-full rounded-xl transition-transform hover:scale-105 hover:cursor-copy'
        style={{ backgroundImage: fmt(L, c, h, L, c, h) }}
        onClick={(_) => {
          const rgb = oklab_to_rgb(oklch_to_oklab({ L, c, h }));
          navigator.clipboard.writeText(rgb_to_hex(rgb));
        }}
        aria-label='Copy Edge Color'
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
  const [startc, setStartc] = useState(0.3);
  const [starth, setStarth] = useState(0.07);
  const [endL, setEndL] = useState(0.6);
  const [endc, setEndc] = useState(0.3);
  const [endh, setEndh] = useState(0.7);

  const [number, setNumber] = useState(2);
  const [numberInput, setNumberInput] = useState('2');

  const setGlobalNumber = (n: number) => {
    setNumberInput(n.toString());
    setNumber(n);
  };

  const MAX = 5;
  const MIN = 2;

  const commit = () => {
    const parsed = parseInt(numberInput, MAX);
    const clamped = isNaN(parsed) ? MIN : Math.min(Math.max(parsed, MIN), MAX);
    setGlobalNumber(clamped);
  };

  let steps = color_step(
    { L: startL, c: startc, h: starth },
    { L: endL, c: endc, h: endh },
    number
  );

  let output = steps.map((color) => {
    let string_color = fmt(
      color.L,
      color.c,
      color.h,
      color.L,
      color.c,
      color.h
    );

    const complement = {
      L: color.L < 0.5 ? 0.95 : 0.05,
      c: Math.min(color.c, 0.1),
      h: (color.h + 0.5) % 1,
    };

    const rgb = rgb_to_hex(
      oklab_to_rgb(
        oklch_to_oklab({ L: color.L, c: color.c, h: color.h * Math.PI })
      )
    );

    const complement_rgb = rgb_to_hex(
      oklab_to_rgb(
        oklch_to_oklab({
          L: complement.L,
          c: complement.c,
          h: complement.h * Math.PI,
        })
      )
    );

    return (
      <button
        className='aspect-square w-[100px] rounded-xl transition-transform hover:scale-105 hover:cursor-copy md:w-[150px]'
        style={{
          backgroundImage: string_color,
          color: complement_rgb,
        }}
        aria-label='Copy Generated Color'
        onClick={(_) => {
          navigator.clipboard.writeText(rgb);
        }}
      >
        {rgb}
      </button>
    );
  });

  return (
    <div id='pallet-generator' className='h-full w-full'>
      <Header name='Pallet Generator' ret={true} />
      {/* color selector */}
      <div className='m-auto mt-10 flex w-fit flex-col space-y-4 space-x-4 md:flex-row'>
        <ColorPicker
          L={startL}
          c={startc}
          h={starth}
          setl={setStartL}
          setc={setStartc}
          seth={setStarth}
        />

        <ColorPicker
          L={endL}
          c={endc}
          h={endh}
          setl={setEndL}
          setc={setEndc}
          seth={setEndh}
        />
      </div>
      {/* number selector */}
      <div className='m-auto mt-6 w-fit'>
        <div className='bg-sumiInk4 flex w-fit items-center gap-2 rounded-xl p-2 text-white'>
          <button
            className='rounded px-3 text-lg font-bold hover:cursor-pointer'
            aria-label='Increase number of colors'
            onClick={(_) => {
              setGlobalNumber(Math.max(number - 1, MIN));
            }}
          >
            –
          </button>
          <input
            className='w-16 [appearance:textfield] bg-transparent text-center text-lg outline-none'
            aria-label='Number of Colors'
            value={numberInput}
            onChange={(e) => {
              const val = parseInt(e.target.value, MAX);
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
              setGlobalNumber(Math.min(number + 1, MAX));
            }}
            aria-label='Decrease number of colors'
          >
            +
          </button>
        </div>
      </div>
      {/* output */}
      <div className='mx-auto mt-5 flex min-w-[200px] flex-wrap justify-center gap-4 md:w-3/4'>
        {output}
      </div>
    </div>
  );
}
