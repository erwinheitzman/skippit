import { resolve } from 'path';
import { readFiles, processFiles } from './json-processor';

const dummyJsonFiles = readFiles([resolve(process.cwd(), 'test-data/results/result.json')]);
const mockJsonFileWithoutSuites = ['{}'];
const mockJsonFileWithoutTests = ['{ "suites": [{}] }'];

test('should calculate the amount of failed tests', () => {
	expect(processFiles(dummyJsonFiles)).toEqual({
		'complete all todos': 2,
		'delete all completed todos': 1,
	});
});

test('should return an empty object if no suites where found', () => {
	expect(processFiles(mockJsonFileWithoutSuites)).toEqual({});
});

test('should return an empty object if no tests where found', () => {
	expect(processFiles(mockJsonFileWithoutTests)).toEqual({});
});
