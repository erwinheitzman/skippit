import { resolve } from 'path';
import {
	lstatSync,
	readdirSync,
	readFileSync,
	mkdirSync,
	writeFileSync,
} from 'fs';

const dataDir = 'test-data';
const tempDir = '.tmp';

mkdirSync(resolve(process.cwd(), tempDir));

function createSetupFilesRecursive(path: string): void {
	readdirSync(path).forEach((file: string) => {
		const curPath: string = resolve(path, file);
		if (lstatSync(curPath).isDirectory()) {
			mkdirSync(curPath.replace(dataDir, tempDir));
			createSetupFilesRecursive(curPath);
		} else {
			writeFileSync(curPath.replace(dataDir, tempDir), readFileSync(curPath), 'utf8');
		}
	});
}

createSetupFilesRecursive(resolve(process.cwd(), dataDir));