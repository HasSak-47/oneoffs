import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

function Options() {
  const links = ['Notes', 'PalletGenerator', 'Blog', 'Crypto'];
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    if (focusedIndex !== null) {
      linkRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const move = (delta: number, def: number) => {
      return (prev: number | null) => {
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

    // arrows or vim motions babyyy
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      setFocusedIndex(move(1, 0));
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      setFocusedIndex(move(-1, links.length - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFocusedIndex(null);
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
      className='flex h-full flex-col'
      ref={rootRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className='mx-auto w-full max-w-2xl px-4 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-lightBlue mb-2 text-4xl font-bold'>
            Developer Utilities
          </h1>
          <p className='text-oldWhite text-lg opacity-80'>
            Quick access to your favorite tools
          </p>
        </div>
        <div
          id='utils'
          className='bg-sumiInk2 flex flex-col space-y-4 rounded-xl p-6'
        >
          {links.map((link, index) => (
            <Link
              key={link}
              id={link}
              className='text-oldWhite bg-sumiInk3 border-sumiInk5 hover:border-waveBlue1 group flex h-fit w-full items-center justify-center gap-3 rounded-lg border p-4 text-xl shadow-md transition-all hover:scale-[1.02] hover:shadow-lg'
              to={`/${link}`}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              tabIndex={-1}
              onMouseOver={() => setFocusedIndex(index)}
              onMouseLeave={() => {
                if (focusedIndex !== null) {
                  linkRefs.current[focusedIndex]?.blur();
                }
                setFocusedIndex(null);
              }}
            >
              {formatLabel(link)}
            </Link>
          ))}
        </div>
      </div>

      <footer className='mt-auto hidden py-4 text-center text-sm font-bold text-white opacity-60 md:block'>
        <p>Use keyboard or vim motions arrows to navigate. Enter to select</p>
      </footer>
    </div>
  );
}

export default Options;
