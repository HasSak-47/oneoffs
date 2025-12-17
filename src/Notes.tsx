import { useEffect, useState } from 'react';
import Header from './Header';
import {
  FolderIcon,
  Bars3CenterLeftIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/16/solid';
import { atry_catch, Result } from './result';

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

  set(path: string, data: string) {
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    const fileName = parts.pop()!;
    let current: Folder = this;

    for (const part of parts) {
      if (!(part in current.inner) || typeof current.inner[part] === 'string') {
        console.error('file not found');
        break;
      }
      current = current.inner[part] as Folder;
    }

    current.inner[fileName] = data;
  }

  get(path: string) {
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current: Folder = this;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      const entry = current.inner[part];

      if (entry === undefined) return null;

      if (i === parts.length - 1) return entry;
      else {
        if (typeof entry === 'string') return null;
        current = entry;
      }
    }

    return current;
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

  static fromJSON(json: any): Folder {
    const folder = new Folder();
    for (const [key, value] of Object.entries(json)) {
      if (typeof value === 'string') {
        folder.inner[key] = value;
      } else {
        folder.inner[key] = Folder.fromJSON(value);
      }
    }
    return folder;
  }

  toJSON(): any {
    const obj: any = {};
    for (const [key, value] of Object.entries(this.inner)) {
      obj[key] = typeof value === 'string' ? value : value.toJSON();
    }
    return obj;
  }
}

type TreeProps = {
  name: string;
  node: Folder | string;
  path: string;
  onAddFile: (path: string) => void;
  onAddFolder: (path: string) => void;
  onDelete: (path: string) => void;
  onSelect: (path: string) => void;
};

function TreeNode({
  name,
  node,
  path,
  onAddFile,
  onAddFolder,
  onDelete,
  onSelect,
}: TreeProps) {
  const [open, setOpen] = useState(true);

  /* render file */
  if (typeof node === 'string') {
    return (
      <div className='flex items-center justify-between space-x-2'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={(_) => onSelect(path)}
            aria-label='Open File'
            className='hover:cursor-pointer'
          >
            <Bars3CenterLeftIcon className='size-4' />
          </button>
          <span>{name}</span>
        </div>
        <button
          className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
          onClick={() => onDelete(path)}
          aria-label='Delete File'
        >
          <TrashIcon className='text-sumiInk0 size-4' />
        </button>
      </div>
    );
  }

  /* render folder */
  return (
    <div className='text-oldWhite'>
      <div className='flex items-center justify-between space-x-2'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setOpen(!open)}
            aria-label='Toggle folder'
            className='hover:cursor-pointer'
          >
            {open ? (
              <FolderOpenIcon className='size-4' />
            ) : (
              <FolderIcon className='size-4' />
            )}
          </button>
          <span className='font-semibold'>{name}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
            onClick={() => onAddFile(path)}
            aria-label='Create File'
          >
            <DocumentPlusIcon className='text-sumiInk0 size-4' />
          </button>
          <button
            className='bg-sakuraPink hover:bg-waveAqua2 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
            onClick={() => onAddFolder(path)}
            aria-label='Create Folder'
          >
            <FolderPlusIcon className='text-sumiInk0 size-4' />
          </button>
          <button
            className='bg-waveRed hover:bg-waveAqua1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
            onClick={() => onDelete(path)}
            aria-label='Delete Folder'
          >
            <TrashIcon className='text-sumiInk0 size-4' />
          </button>
        </div>
      </div>
      {open && (
        <div className='ml-4'>
          {Object.entries(node.inner)
            .sort(([aName, aNode], [bName, bNode]) => {
              const aIsFolder = typeof aNode !== 'string';
              const bIsFolder = typeof bNode !== 'string';

              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;

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
                onSelect={onSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function Notes() {
  const [root, setRoot] = useState<Folder>(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('notesData='))
      ?.split('=')[1];

    if (cookie) {
      try {
        return Folder.fromJSON(JSON.parse(decodeURIComponent(cookie)));
      } catch (e) {
        console.error('Failed to parse cookie data:', e);
      }
    }

    let folder = new Folder();

    folder.add_file('readme', '');
    folder.add_file('intro', '');
    async function f(name: string) {
      let result: Result<Response, Error> = await atry_catch(
        fetch,
        `/oneoffs/assets/notes/${name}.txt`
      );
      if (!result.ok()) {
        console.log('result not ok', result.unwrap_err());
        return;
      }

      let response = result.unwrap()!;
      if (!response.ok) {
        console.log('respone not ok');
        return;
      }

      folder.set(name, await response.text());
    }
    f('intro');
    f('readme');

    return folder;
  });

  useEffect(() => {}, []);

  const [showPrompt, setShowPrompt] = useState<null | 'file' | 'folder'>(null);
  const [promptPath, setPromptPath] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const [deletePath, setDeletePath] = useState<string | null>(null);

  const update = (fn: (folder: Folder) => void) => {
    const newRoot = root.clone();
    fn(newRoot);
    setRoot(newRoot);
    setCookie('notesData', JSON.stringify(newRoot.toJSON()));
  };

  const handleAddFile = (path: string) => {
    setPromptPath(path);
    setPromptInput('');
    setShowPrompt('file');
  };

  const handleAddFolder = (path: string) => {
    setPromptPath(path);
    setPromptInput('');
    setShowPrompt('folder');
  };

  const handleDelete = (path: string) => {
    setDeletePath(path);
  };

  const [showExplorer, setShowExplorer] = useState(false);
  const [text, setText] = useState('');

  const [filePath, setFilePath] = useState<string | null>(null);
  const handleSelection = (path: string) => {
    setFilePath(path);
    const data = root.get(path);

    if (typeof data === 'string') setText(data);
    else setText('');
  };

  return (
    <div className='relative flex h-full flex-col'>
      <Header name='Notes' ret={true} />

      {!showExplorer && (
        <button
          className='bg-sumiInk3 border-sumiInk5 fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg hover:cursor-pointer md:hidden'
          aria-label='Toggle folder'
          onClick={() => setShowExplorer((prev) => !prev)}
        >
          <Bars3Icon className='text-oldWhite w-3/4' />
        </button>
      )}

      <div className='flex flex-1 justify-between'>
        {/* div full or empty for the text area*/}
        {filePath !== null ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (filePath !== null) {
                root.set(filePath, text);
                setRoot(root.clone());
                setCookie('notesData', JSON.stringify(root.toJSON()));
              }
            }}
            className='flex h-full flex-1 flex-col'
          >
            {/* Button Row */}
            <div className='flex justify-end gap-2 p-2'>
              <div className='text-oldWhite'>{filePath}</div>
              <button
                type='button'
                className='text-waveRed h-6 w-6 cursor-pointer'
                aria-label='Close file'
                onClick={() => setFilePath(null)}
              >
                <XMarkIcon />
              </button>
              <button
                type='submit'
                aria-label='Save file'
                className='text-waveAqua1 h-6 w-6 cursor-pointer'
              >
                <CheckIcon />
              </button>
            </div>

            {/* Textarea fills the rest */}
            <div className='flex-grow p-2'>
              <textarea
                className='border-sumiInk5 bg-sumiInk3 text-oldWhite h-full w-full resize-none rounded-md border p-4'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </form>
        ) : (
          <div />
        )}

        {/* panel for the explorer on !mobile */}
        <div className='bg-sumiInk3 border-sumiInk5 m-1 hidden w-1/4 max-w-[360px] min-w-[220px] flex-1 overflow-auto rounded-2xl border p-2 md:block'>
          <TreeNode
            name='root'
            node={root}
            path=''
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            onDelete={handleDelete}
            onSelect={handleSelection}
          />
        </div>

        {/* panel for the explorer on mobile */}
        {showExplorer && (
          <div className='bg-sumiInk3 border-sumiInk5 fixed right-4 bottom-20 left-4 z-40 max-h-[70%] overflow-auto rounded-2xl border p-2 md:hidden'>
            <button
              className='text-waveRed relative h-6 w-6'
              onClick={() => setShowExplorer((prev) => !prev)}
              aria-label='Delete Folder'
            >
              <XMarkIcon />
            </button>
            <TreeNode
              name='root'
              node={root}
              path=''
              onAddFile={handleAddFile}
              onAddFolder={handleAddFolder}
              onDelete={handleDelete}
              onSelect={handleSelection}
            />
          </div>
        )}
      </div>
      {/* Prompts */}
      {showPrompt && (
        <div className='bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-sumiInk3 border-sumiInk5 text-oldWhite w-80 rounded-xl border p-4'>
            <h2 className='mb-2 text-lg font-semibold'>
              {showPrompt === 'file' ? 'New File' : 'New Folder'} Name:
            </h2>
            <input
              autoFocus
              className='border-sumiInk5 bg-sumiInk0 text-fujiWhite w-full rounded-md border p-2 hover:cursor-pointer'
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && promptInput.trim()) {
                  const fullPath = `${promptPath}/${promptInput.trim()}`;
                  update((folder) => {
                    if (showPrompt === 'file') folder.add_file(fullPath, '');
                    else folder.add_folder(fullPath);
                  });
                  setShowPrompt(null);
                }
              }}
            />
            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setShowPrompt(null)}
                className='text-waveRed text-sm hover:cursor-pointer'
                aria-label='Cancel Creation'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!promptInput.trim()) return;
                  const fullPath = `${promptPath}/${promptInput.trim()}`;
                  update((folder) => {
                    if (showPrompt === 'file') folder.add_file(fullPath, '');
                    else folder.add_folder(fullPath);
                  });
                  setShowPrompt(null);
                }}
                aria-label='Create'
                className='bg-waveAqua2 text-sumiInk0 rounded px-3 py-1 text-sm hover:cursor-pointer'
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletePath && (
        <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-sumiInk3 border-sumiInk5 text-oldWhite w-80 rounded-xl border p-4'>
            <h2 className='mb-4 text-lg font-semibold'>Delete this item?</h2>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setDeletePath(null)}
                className='text-waveAqua1 text-sm hover:cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  update((folder) => folder.delete(deletePath));
                  setDeletePath(null);
                }}
                className='bg-waveRed text-sumiInk0 hoer:cursor-pointer rounded px-3 py-1 text-sm'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
