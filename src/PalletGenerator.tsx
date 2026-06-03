import { ChangeEventHandler, useState } from 'react';
import {
  clamp_oklch_turn_to_srgb,
  HueMode,
  in_between_palette,
  oklab_to_rgb,
  okLch,
  oklch_to_oklab,
  PaletteSettings,
  rgb_to_hex,
  root_palette,
} from './color';
import Header from './Header';

type GeneratorMode = 'between' | 'around';

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
  const setSafeColor = (color: okLch) => {
    const safeColor = clamp_oklch_turn_to_srgb(color);

    setl(safeColor.L);
    setc(safeColor.c);
    seth(safeColor.h);
  };

  const displayColor = clamp_oklch_turn_to_srgb({ L, c, h });
  const rgb = oklab_to_rgb(
    oklch_to_oklab({
      L: displayColor.L,
      c: displayColor.c,
      h: displayColor.h * Math.PI * 2,
    })
  );
  const rgbText = rgb_to_hex(rgb);
  const textColor = rgb_to_hex(
    oklab_to_rgb(
      oklch_to_oklab({
        L: displayColor.L < 0.5 ? 0.95 : 0.05,
        c: Math.min(displayColor.c, 0.1),
        h: ((displayColor.h + 0.5) % 1) * Math.PI * 2,
      })
    )
  );

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
          className='min-w-0 flex-1 appearance-none rounded-xl hover:scale-105'
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
    setSafeColor({ L: parseInt(e.target.value, 10) / 1000, c, h })
  );
  const Okc = sliderMaker(c, fmt(L, 0, h, L, 1, h), (e) =>
    setSafeColor({ L, c: parseInt(e.target.value, 10) / 1000, h })
  );
  const Okh = sliderMaker(h, bg_rainbow, (e) =>
    setSafeColor({ L, c, h: parseInt(e.target.value, 10) / 1000 })
  );

  return (
    <div className='max-w-50 md:max-w-100'>
      <button
        className='aspect-square w-full rounded-xl font-mono text-sm transition-transform hover:scale-105 hover:cursor-copy'
        style={{
          backgroundImage: fmt(
            displayColor.L,
            displayColor.c,
            displayColor.h,
            displayColor.L,
            displayColor.c,
            displayColor.h
          ),
          color: textColor,
        }}
        onClick={(_) => {
          navigator.clipboard.writeText(rgb_to_hex(rgb));
        }}
        aria-label='Copy Edge Color'
      >
        {rgbText}
      </button>
      <div className='w-full'>
        {OkL}
        {Okc}
        {Okh}
      </div>
    </div>
  );
}

function makeOutput(rawColor: okLch) {
  const color = clamp_oklch_turn_to_srgb(rawColor);
  const string_color = fmt(
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

  const rgb = oklab_to_rgb(
    oklch_to_oklab({ L: color.L, c: color.c, h: color.h * Math.PI * 2 })
  );

  const complement_rgb = rgb_to_hex(
    oklab_to_rgb(
      oklch_to_oklab({
        L: complement.L,
        c: complement.c,
        h: complement.h * Math.PI * 2,
      })
    )
  );

  return (
    <button
      className='aspect-square min-h-50 min-w-50 rounded-xl transition-transform hover:scale-105 hover:cursor-copy md:w-37.5'
      style={{
        backgroundImage: string_color,
        color: complement_rgb,
      }}
      aria-label='Copy Generated Color'
      onClick={(_) => {
        navigator.clipboard.writeText(rgb_to_hex(rgb));
      }}
    >
      {rgb_to_hex(rgb)}
    </button>
  );
}
export default function PalletGenerator() {
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('between');
  const [startL, setStartL] = useState(0.6);
  const [startc, setStartc] = useState(0.3);
  const [starth, setStarth] = useState(0.07);
  const [endL, setEndL] = useState(0.6);
  const [endc, setEndc] = useState(0.3);
  const [endh, setEndh] = useState(0.7);
  const [hueMode, setHueMode] = useState<HueMode>('analogous');
  const [hueContrast, setHueContrast] = useState(0.75);
  const [chromaContrast, setChromaContrast] = useState(0.5);
  const [lightnessContrast, setLightnessContrast] = useState(0.5);

  const [number, setNumber] = useState(2);
  const [numberInput, setNumberInput] = useState('2');

  const setGlobalNumber = (n: number) => {
    setNumberInput(n.toString());
    setNumber(n);
  };

  const MAX = 5;
  const MIN = 2;

  const commit = () => {
    const parsed = parseInt(numberInput, 10);
    const clamped = isNaN(parsed) ? MIN : Math.min(Math.max(parsed, MIN), MAX);
    setGlobalNumber(clamped);
  };

  const rootSettings: PaletteSettings = {
    colorCount: number,
    hueContrast,
    chromaContrast,
    lightnessContrast,
  };

  let steps =
    generatorMode === 'between'
      ? in_between_palette(
        { L: startL, c: startc, h: starth },
        { L: endL, c: endc, h: endh },
        number
      )
      : root_palette(
        { L: startL, c: startc, h: starth * Math.PI * 2 },
        hueMode,
        rootSettings
      ).map((color) => ({
        ...color,
        h: (((color.h / (Math.PI * 2)) % 1) + 1) % 1,
      }));

  const output = steps.map(makeOutput);

  const modeSelector = (
    <div className='bg-sumiInk4 flex w-fit rounded-xl p-1 text-white'>
      <button
        className={`rounded-lg px-4 py-2 ${generatorMode === 'between' ? 'bg-waveBlue2' : ''}`}
        onClick={() => setGeneratorMode('between')}
      >
        Between Colors
      </button>
      <button
        className={`rounded-lg px-4 py-2 ${generatorMode === 'around' ? 'bg-waveBlue2' : ''}`}
        onClick={() => setGeneratorMode('around')}
      >
        Around Point
      </button>
    </div>
  );

  const rootControls = (
    <div className='bg-sumiInk4 flex w-full max-w-90 flex-col gap-3 rounded-xl p-4 text-white md:w-80'>
      <label className='flex items-center justify-between gap-4'>
        <span>Hue Mode</span>
        <select
          className='bg-sumiInk2 rounded-md px-2 py-1'
          value={hueMode}
          onChange={(e) => setHueMode(e.target.value as HueMode)}
        >
          <option value='monochromatic'>Monochromatic</option>
          <option value='analogous'>Analogous</option>
          <option value='complementary'>Complementary</option>
          <option value='triadic complementary'>Triadic</option>
          <option value='tetradic complementary'>Tetradic</option>
        </select>
      </label>
      <label>
        Hue Contrast
        <input
          className='mt-2 w-full'
          type='range'
          min='0'
          max='1000'
          value={hueContrast * 1000}
          onChange={(e) => setHueContrast(parseInt(e.target.value, 10) / 1000)}
        />
      </label>
      <label>
        Chroma Contrast
        <input
          className='mt-2 w-full'
          type='range'
          min='0'
          max='1000'
          value={chromaContrast * 1000}
          onChange={(e) =>
            setChromaContrast(parseInt(e.target.value, 10) / 1000)
          }
        />
      </label>
      <label>
        Lightness Contrast
        <input
          className='mt-2 w-full'
          type='range'
          min='0'
          max='1000'
          value={lightnessContrast * 1000}
          onChange={(e) =>
            setLightnessContrast(parseInt(e.target.value, 10) / 1000)
          }
        />
      </label>
    </div>
  );

  return (
    <div id='pallet-generator' className='h-full w-full'>
      <Header name='Pallet Generator' ret={true} />
      {/* mode selector */}
      <div className='m-auto mt-6 flex w-fit justify-center'>
        {modeSelector}
      </div>
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

        {generatorMode === 'between' ? (
          <ColorPicker
            L={endL}
            c={endc}
            h={endh}
            setl={setEndL}
            setc={setEndc}
            seth={setEndh}
          />
        ) : (
          rootControls
        )}
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
              setGlobalNumber(Math.min(number + 1, MAX));
            }}
            aria-label='Decrease number of colors'
          >
            +
          </button>
        </div>
      </div>
      {/* output */}
      <div className='mx-auto mt-5 flex flex-wrap justify-center gap-4 md:w-3/4'>
        {output}
      </div>
    </div>
  );
}
