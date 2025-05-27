import { HomeIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router';

type HeaderProp = {
  name: string;
  ret?: any;
  extra?: any;
};

/*
 * basic dumb header that will be used everywhere!
 */
export default function Header({ name, ret, extra }: HeaderProp) {
  return (
    <header className='bg-sumiInk4 text-fujiWhite flex items-center justify-between rounded-b-2xl px-6 py-4 shadow-md'>
      <h1 className='text-3xl font-bold tracking-tight'>{name}</h1>

      <div className='flex items-center gap-3'>
        {extra}

        {ret !== undefined ? (
          <Link
            to='/'
            className='flex items-center transition-transform hover:scale-110'
            aria-label='Home'
          >
            <HomeIcon className='text-waveAqua2 h-8 w-8' />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
