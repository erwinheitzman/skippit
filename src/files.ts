import { statSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

export function getFiles(
	dir: string,
	extensions: Array<string> = [],
	recursive: boolean = false
) {
	const regexp = new RegExp('(?:.' + extensions.join('$|.') + '$)');
	const filesList: Array<string> = [];

	if (!existsSync(dir)) {
		return filesList;
	}

	const retrieveFiles = (fullPath: string) => {
		const files = readdirSync(fullPath);

		files.forEach((file) => {
			const filepath = join(fullPath, file);

			if (statSync(filepath).isDirectory()) {
				if (recursive) {
					retrieveFiles(filepath);
				}
				return;
			}

			if (extensions.length && !regexp.test(file)) {
				return;
			}

			filesList.push(filepath);
		});
	};

	retrieveFiles(resolve(process.cwd(), dir));

	return filesList;
}