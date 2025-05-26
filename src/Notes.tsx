import { useState } from 'react';
import Header from './Header';
import {
  FolderIcon,
  Bars3CenterLeftIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';

class Folder {
  inner: { [key: string]: Folder | string };

  constructor() {
    this.inner = {};
  }

  add_file(path: string, data: string) {
    const parts = path.split('/');
    const fileName = parts.pop()!;
    let current: Folder = this;

    for (const part of parts) {
      if (!(part in current.inner) || typeof current.inner[part] === 'string')
        current.inner[part] = new Folder();
      current = current.inner[part] as Folder;
    }

    current.inner[fileName] = data;
  }

  add_folder(path: string): Folder {
    const parts = path.split('/');
    let current: Folder = this;

    for (const part of parts) {
      if (!(part in current.inner) || typeof current.inner[part] === 'string')
        current.inner[part] = new Folder();
      current = current.inner[part] as Folder;
    }

    return current;
  }

  get(path: string): Folder | string | undefined {
    const parts = path.split('/');
    let current: Folder = this;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const entry = current.inner[part];

      if (entry === undefined) return undefined;

      if (i === parts.length - 1) return entry;
      else {
        if (typeof entry === 'string') return undefined;
        current = entry;
      }
    }
  }
}

type TreeProps = {
  name: string;
  node: Folder | string;
  path: string;
};

function TreeNode({ name, node, path }: TreeProps) {
  const [open, setOpen] = useState(true);

  if (typeof node === 'string') {
    return (
      <div className='mt-1 ml-4 flex items-center space-x-2'>
        <Bars3CenterLeftIcon className='size-4' />
        <span>{name}</span>
        <button className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'>
          <TrashIcon className='text-sumiInk0 size-4' />
        </button>
      </div>
    );
  }

  // It's a folder
  return (
    <div className='text-oldWhite mt-1 ml-2'>
      <div className='flex items-center space-x-2'>
        <button onClick={() => setOpen(!open)}>
          {open ? (
            <FolderOpenIcon className='size-4' />
          ) : (
            <FolderIcon className='size-4' />
          )}
        </button>
        <span className='font-semibold'>{name}</span>
        <button className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'>
          <DocumentPlusIcon className='text-sumiInk0 size-4' />
        </button>
        <button className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'>
          <FolderPlusIcon className='text-sumiInk0 size-4' />
        </button>
        <button className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'>
          <TrashIcon className='text-sumiInk0 size-4' />
        </button>
      </div>
      {open && (
        <div className='ml-4'>
          {Object.entries(node.inner).map(([childName, childNode]) => (
            <TreeNode
              key={childName}
              name={childName}
              node={childNode}
              path={`${path}/${childName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  const root = new Folder();
  root.add_file('readme.txt', 'Welcome');
  root.add_file('intro.txt', 'Intro content');

  return (
    <div className='p-4'>
      <Header name='Notes' ret={true} />
      <TreeNode name='root' node={root} path='' />
    </div>
  );
}
