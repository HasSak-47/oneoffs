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

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/keybinding-vim';

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
	activePath: string | null;
};

function TreeNode({
	name,
	node,
	path,
	onAddFile,
	onAddFolder,
	onDelete,
	onSelect,
	activePath,
}: TreeProps) {
	const [open, setOpen] = useState(true);

	/* render file */
	if (typeof node === 'string') {
		const isActive = activePath === path;
		return (
			<div
				className={`group flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm transition-colors ${
					isActive
						? 'bg-waveBlue1 text-fujiWhite border-waveBlue2 border'
						: 'text-oldWhite border border-transparent hover:bg-sumiInk4'
				}`}
			>
				<div className='flex min-w-0 items-center gap-2'>
					<button
						onClick={(_) => onSelect(path)}
						aria-label='Open File'
						className='text-waveAqua2 hover:text-waveAqua1 hover:cursor-pointer'
					>
						<Bars3CenterLeftIcon className='size-4' />
					</button>
					<span className='truncate'>{name}</span>
				</div>
				<button
					className='bg-waveRed hover:bg-peachRed rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
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
			<div className='flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-sumiInk4'>
				<div className='flex min-w-0 items-center gap-2'>
					<button
						onClick={() => setOpen(!open)}
						aria-label='Toggle folder'
						className='text-lightBlue hover:text-waveAqua1 hover:cursor-pointer'
					>
						{open ? (
							<FolderOpenIcon className='size-4' />
						) : (
							<FolderIcon className='size-4' />
						)}
					</button>
					<span className='font-semibold text-fujiWhite'>{name}</span>
				</div>
				<div className='flex items-center gap-2'>
					<button
						className='bg-waveBlue2 hover:bg-waveBlue1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
						onClick={() => onAddFile(path)}
						aria-label='Create File'
					>
						<DocumentPlusIcon className='text-fujiWhite size-4' />
					</button>
					<button
						className='bg-waveBlue2 hover:bg-waveBlue1 rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
						onClick={() => onAddFolder(path)}
						aria-label='Create Folder'
					>
						<FolderPlusIcon className='text-fujiWhite size-4' />
					</button>
					<button
						className='bg-waveRed hover:bg-peachRed rounded px-2 py-0.5 text-sm transition-all hover:scale-110 hover:cursor-pointer'
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
								activePath={activePath}
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

type InitialFolderState = {
	folder: Folder;
	hasStoredNotes: boolean;
};

function loadInitialFolder(): InitialFolderState {
	const cookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith('notesData='))
		?.split('=')[1];

	if (cookie) {
		try {
			return {
				folder: Folder.fromJSON(JSON.parse(decodeURIComponent(cookie))),
				hasStoredNotes: true,
			};
		} catch (e) {
			console.error('Failed to parse cookie data:', e);
		}
	}

	const folder = new Folder();
	folder.add_file('readme', '');
	folder.add_file('intro', '');

	return { folder, hasStoredNotes: false };
}

export default function Notes() {
	const [initialState] = useState(loadInitialFolder);
	const [root, setRoot] = useState<Folder>(initialState.folder);

	useEffect(() => {
		if (initialState.hasStoredNotes) return;

		let cancelled = false;
		const seedFiles = async () => {
			const names = ['intro', 'readme'];
			const results = await Promise.all(
				names.map(async (name) => {
					const result: Result<Response, Error> = await atry_catch(
						fetch,
						`/oneoffs/assets/notes/${name}.txt`
					);
					if (!result.ok()) {
						console.log('result not ok', result.unwrap_err());
						return { name, text: null };
					}

					const response = result.unwrap()!;
					if (!response.ok) {
						console.log('respone not ok');
						return { name, text: null };
					}

					return { name, text: await response.text() };
				})
			);

			if (cancelled) return;
			setRoot((prev) => {
				const next = prev.clone();
				for (const { name, text } of results) {
					if (typeof text === 'string') next.set(name, text);
				}
				return next;
			});
		};

		seedFiles();
		return () => {
			cancelled = true;
		};
	}, [initialState.hasStoredNotes]);

	useEffect(() => {
		setCookie('notesData', JSON.stringify(root.toJSON()));
	}, [root]);

	const [showPrompt, setShowPrompt] = useState<null | 'file' | 'folder'>(null);
	const [promptPath, setPromptPath] = useState('');
	const [promptInput, setPromptInput] = useState('');

	const [deletePath, setDeletePath] = useState<string | null>(null);

	const update = (fn: (folder: Folder) => void) => {
		setRoot((prev) => {
			const next = prev.clone();
			fn(next);
			return next;
		});
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
	const [useVimMode, setUseVimMode] = useState(false);
	const handleSelection = (path: string) => {
		setFilePath(path);
		const data = root.get(path);

		if (typeof data === 'string') setText(data);
		else setText('');

		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			setShowExplorer(false);
		}
	};

	return (
		<div className='relative flex h-full flex-col bg-sumiInk1 text-fujiWhite'>
			<Header name='Notes' ret={true} />

			{!showExplorer && (
				<button
					className='bg-waveBlue2 border-waveBlue1 fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg hover:cursor-pointer md:hidden'
					aria-label='Toggle folder'
					onClick={() => setShowExplorer((prev) => !prev)}
				>
					<Bars3Icon className='text-fujiWhite w-3/4' />
				</button>
			)}

			<div className='flex flex-1 gap-3 px-3 pb-3 pt-2'>
				{/* div full or empty for the text area*/}
				{filePath !== null ? (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (filePath !== null) {
								update((folder) => folder.set(filePath, text));
							}
						}}
						className='flex h-full flex-1 flex-col'
					>
						<div className='flex min-h-0 flex-1 flex-col shadow-lg'>
							{/* Button Row */}
							<div className='border-sumiInk4 bg-sumiInk2 flex items-center justify-between gap-3 rounded-t-xl border px-3 py-2'>
								<div className='text-fujiGray truncate text-sm'>{filePath}</div>
								<div className='flex items-center gap-3'>
									<button
										type='button'
										onClick={() => setUseVimMode((prev) => !prev)}
										aria-pressed={useVimMode}
										aria-label='Toggle Vim mode'
										className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
											useVimMode
												? 'border-waveAqua2 text-waveAqua2'
												: 'border-sumiInk4 text-fujiGray hover:text-fujiWhite'
										}`}
									>
										Vim
									</button>
									<button
										type='button'
										className='text-waveRed hover:text-peachRed h-6 w-6 cursor-pointer'
										aria-label='Close file'
										onClick={() => setFilePath(null)}
									>
										<XMarkIcon />
									</button>
									<button
										type='submit'
										aria-label='Save file'
										className='text-waveAqua2 hover:text-waveAqua1 h-6 w-6 cursor-pointer'
									>
										<CheckIcon />
									</button>
								</div>
							</div>

							{/* Textarea fills the rest */}
							<div className='min-h-0 grow'>
								<AceEditor
									mode='markdown'
									theme='nord_dark'
									value={text}
									onChange={setText}
									name='notes-editor'
									width='100%'
									height='100%'
									fontSize={14}
									keyboardHandler={useVimMode ? 'vim' : undefined}
									showPrintMargin={false}
									setOptions={{
										useWorker: false,
										wrap: true,
									}}
									className='notes-editor border-sumiInk4 rounded-b-xl border border-t-0'
								/>
							</div>
						</div>
					</form>
				) : (
					<div />
				)}

				{/* panel for the explorer on !mobile */}
				<div className='bg-sumiInk2 border-sumiInk4 hidden w-1/4 max-w-[360px] min-w-[220px] flex-1 overflow-auto rounded-2xl border p-3 shadow-lg md:block'>
					<TreeNode
						name='root'
						node={root}
						path=''
						onAddFile={handleAddFile}
						onAddFolder={handleAddFolder}
						onDelete={handleDelete}
						onSelect={handleSelection}
						activePath={filePath}
					/>
				</div>

				{/* panel for the explorer on mobile */}
				{showExplorer && (
					<div className='bg-sumiInk2 border-sumiInk4 fixed right-4 bottom-20 left-4 z-40 max-h-[70%] overflow-auto rounded-2xl border p-3 shadow-lg md:hidden'>
						<button
							className='text-waveRed hover:text-peachRed relative h-6 w-6'
							onClick={() => setShowExplorer((prev) => !prev)}
							aria-label='Close Explorer'
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
							activePath={filePath}
						/>
					</div>
				)}
			</div>
			{/* Prompts */}
			{showPrompt && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
					<div className='bg-sumiInk2 border-sumiInk4 text-fujiWhite w-80 rounded-xl border p-4 shadow-xl'>
						<h2 className='mb-2 text-lg font-semibold'>
							{showPrompt === 'file' ? 'New File' : 'New Folder'} Name:
						</h2>
						<input
							autoFocus
							className='border-sumiInk4 bg-sumiInk1 text-fujiWhite w-full rounded-md border p-2 hover:cursor-pointer'
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
								className='text-waveRed hover:text-peachRed text-sm hover:cursor-pointer'
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
								className='bg-waveAqua2 text-sumiInk0 hover:bg-waveAqua1 rounded px-3 py-1 text-sm hover:cursor-pointer'
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation */}
			{deletePath && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
					<div className='bg-sumiInk2 border-sumiInk4 text-fujiWhite w-80 rounded-xl border p-4 shadow-xl'>
						<h2 className='mb-4 text-lg font-semibold'>Delete this item?</h2>
						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setDeletePath(null)}
								className='text-waveAqua1 hover:text-waveAqua2 text-sm hover:cursor-pointer'
							>
								Cancel
							</button>
							<button
								onClick={() => {
									update((folder) => folder.delete(deletePath));
									setDeletePath(null);
								}}
								className='bg-waveRed text-sumiInk0 hover:bg-peachRed hover:cursor-pointer rounded px-3 py-1 text-sm'
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
