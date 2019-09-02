import { readFileSync, writeFileSync, existsSync } from 'fs';
import { getFiles } from './files';
import { Config } from './config';
import { readFiles, processFiles } from './processors/json-processor';

export function disable({ results, tests, maxFailures }: Config) {
	if (!existsSync(results.path)) {
		throw new Error(`Directory ${results.path} does not exist`);
	}

	if (!existsSync(tests.path)) {
		throw new Error(`Directory ${tests.path} does not exist`);
	}

	const failures = processFiles(
		readFiles(
			getFiles(results.path, results.formats, true)
		)
	)

	function disableTests(file: string, data: any) {
		let newData = data;

		for (const test in failures) {
			const regex = new RegExp(
				// Matches (arrow) function(s) declaration/expression(s)
				// with and without parameters/values
				'(it|test)(\\([\'|"]' + test + '[\'|"],\\s?'
				+ '(?:function\\s?\\((?:[\'|"]?\\w+)?[\'|"]?\\)\\s?{'
				+ '|'
				+ '\\w+\\);?'
				+ '|'
				+ '\\(?(?:[\'|"]?\\w+)?[\'|"]?\\)?\\s?=>\\s?{?))', 'gi'
			);

			if (failures[test] >= maxFailures) {
				if (regex.test(newData)) {
					newData = newData.replace(regex, '$1.skip$2');
					writeFileSync(file, newData, 'utf8');
				}
			}
		}
	}

	const testFiles = getFiles(tests.path, tests.formats, true);

	for (const file of testFiles) {
		const testData = readFileSync(file, 'utf8');
		disableTests(file, testData);
	}
}