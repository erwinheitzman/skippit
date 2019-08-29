const { resolve } = require('path');
const {
	lstatSync,
	readdirSync,
	readFileSync,
	mkdirSync,
	writeFileSync,
} = require('fs');

const dataDir = 'test-data';
const tempDir = '.tmp';

mkdirSync(resolve(process.cwd(), tempDir));

function createSetupFilesRecursive(path) {
	readdirSync(path).forEach((file) => {
		const curPath = resolve(path, file);
		if (lstatSync(curPath).isDirectory()) {
			mkdirSync(curPath.replace(dataDir, tempDir));
			createSetupFilesRecursive(curPath);
		} else {
			writeFileSync(curPath.replace(dataDir, tempDir), readFileSync(curPath), 'utf8');
		}
	});
}

createSetupFilesRecursive(resolve(process.cwd(), dataDir));