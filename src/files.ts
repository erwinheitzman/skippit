import { statSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

export function getFiles(
	dir: string,
	extensions: Array<string> = [],
	recursive: boolean = false
) {
	const filesList: Array<string> = [];
	const resolvedDir = resolve(process.cwd(), dir);

	if (!existsSync(resolvedDir)) {
		return filesList;
	}

	const regexp = new RegExp('(?:.' + extensions.join('$|.') + '$)');
	const retrieveFiles = (fullPath: string) => {
		readdirSync(fullPath)
			.forEach((file) => {
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

	retrieveFiles(resolvedDir);

	return filesList;
}