import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function Options() {
  const links = ['Notes', 'PalletGenerator', 'Blog'];
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
    <div id='utils-root' ref={rootRef} onKeyDown={handleKeyDown} tabIndex={0}>
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
  );
}

export default Options;
