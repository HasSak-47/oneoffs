import Header from './Header';

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

function Root() {
	const root_element = new Folder();

	return <div />;
}

export default function Notes() {
	return (
		<div>
			<Header name='Notes' ret={true} />
			<Root />;
		</div>
	);
}
