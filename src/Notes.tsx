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
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    const fileName = parts.pop()!;
    let current: Folder = this;

    for (const part of parts) {
      if (!(part in current.inner) || typeof current.inner[part] === 'string') {
        current.inner[part] = new Folder();
      }
      current = current.inner[part] as Folder;
    }

    current.inner[fileName] = data;
  }

  add_folder(path: string): Folder {
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current: Folder = this;

    for (const part of parts) {
      if (!(part in current.inner) || typeof current.inner[part] === 'string') {
        current.inner[part] = new Folder();
      }
      current = current.inner[part] as Folder;
    }

    return current;
  }

  delete(path: string) {
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    const name = parts.pop();
    let current: Folder = this;

    for (const part of parts) {
      const node = current.inner[part];
      if (!node || typeof node === 'string') {
        return;
      }
      current = node;
    }

    if (name && name in current.inner) {
      delete current.inner[name];
    }
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

  clone(): Folder {
    const copy = new Folder();
    for (const [key, value] of Object.entries(this.inner)) {
      if (typeof value === 'string') {
        copy.inner[key] = value;
      } else {
        copy.inner[key] = value.clone();
      }
    }
    return copy;
  }
}

type TreeProps = {
  name: string;
  node: Folder | string;
  path: string;
  onAddFile: (path: string) => void;
  onAddFolder: (path: string) => void;
  onDelete: (path: string) => void;
};

function TreeNode({
  name,
  node,
  path,
  onAddFile,
  onAddFolder,
  onDelete,
}: TreeProps) {
  const [open, setOpen] = useState(true);

  if (typeof node === 'string') {
    return (
      <div className='mt-1 ml-4 flex items-center space-x-2'>
        <Bars3CenterLeftIcon className='size-4' />
        <span>{name}</span>
        <button
          className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
          onClick={() => onDelete(path)}
        >
          <TrashIcon className='text-sumiInk0 size-4' />
        </button>
      </div>
    );
  }

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
        <button
          className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
          onClick={() => onAddFile(path)}
        >
          <DocumentPlusIcon className='text-sumiInk0 size-4' />
        </button>
        <button
          className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
          onClick={() => onAddFolder(path)}
        >
          <FolderPlusIcon className='text-sumiInk0 size-4' />
        </button>
        <button
          className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
          onClick={() => onDelete(path)}
        >
          <TrashIcon className='text-sumiInk0 size-4' />
        </button>
      </div>
      {open && (
        <div className='ml-4'>
          {Object.entries(node.inner)
            .sort(([aName, aNode], [bName, bNode]) => {
              const aIsFolder = typeof aNode !== 'string';
              const bIsFolder = typeof bNode !== 'string';

              // Folders first
              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;

              // Then sort alphabetically
              return aName.localeCompare(bName);
            })
            .map(([childName, childNode]) => (
              <TreeNode
                key={childName}
                name={childName}
                node={childNode}
                path={`${path}/${childName}`}
                onAddFile={onAddFile}
                onAddFolder={onAddFolder}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  const [root, setRoot] = useState(
    (() => {
      let folder = new Folder();
      folder.add_file('readme.txt', 'Welcome');
      folder.add_file('intro.txt', 'Intro content');
      folder.add_folder('folder');
      return folder;
    })()
  );

  const update = (fn: (folder: Folder) => void) => {
    const newRoot = root.clone();
    fn(newRoot);
    console.log(newRoot);
    setRoot(newRoot);
  };

  const handleAddFile = (path: string) => {
    const name = prompt('Enter new file name:');
    if (!name) return;
    update((folder) => {
      folder.add_file(`${path}/${name}`, '');
    });
  };

  const handleAddFolder = (path: string) => {
    const name = prompt('Enter new folder name:');
    if (!name) return;
    update((folder) => {
      let p = `${path}/${name}`;
      console.log(p);
      folder.add_folder(p);
    });
  };

  const handleDelete = (path: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    update((folder: Folder) => {
      console.log(typeof folder);
      folder.delete(path);
    });
  };

  return (
    <div className='p-4'>
      <Header name='Notes' ret={true} />
      <div></div>
      <div>
        <TreeNode
          name='root'
          node={root}
          path=''
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
