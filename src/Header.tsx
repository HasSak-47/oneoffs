import { HomeIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router';

type HeaderProp = {
  name: string;
  ret?: any;
};

export default function Header({ name, ret }: HeaderProp) {
  return (
    <header className='text-fujiWhite bg-sumiInk4 flex h-fit justify-between rounded-b-2xl p-3 pr-5 pl-5 text-3xl'>
      <h1> {name} </h1>
      {ret !== undefined ? (
        <Link className='align-middle' to='/'>
          <HomeIcon className='text-fujiWhite h-8' />
        </Link>
      ) : (
        <div />
      )}
    </header>
  );
}
