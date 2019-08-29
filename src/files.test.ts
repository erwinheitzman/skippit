import { resolve } from 'path';
import { getFiles } from './files';

const dir = '.tmp/results';

test('should with a absolute path', () => {
	expect(getFiles(resolve(process.cwd(), dir)).length).toEqual(2);
});

test('should with a relative path', () => {
	expect(getFiles(dir).length).toEqual(2);
});

test('should return files (empty array) if the directory does not exist', () => {
	expect(getFiles('does/not/exist')).toEqual([]);
});

test('should return a array of all files from the given directory', () => {
	expect(getFiles(dir).length).toEqual(2);
});

test('should return a array of all files from the given directory and all sub directories', () => {
	expect(getFiles(dir, [], true).length).toEqual(4);
});

test('should return a array of all xml files from the given directory', () => {
	expect(getFiles(dir, ['xml']).length).toEqual(1);
});

test('should return a array of all xml files from the given directory and all sub directories', () => {
	expect(getFiles(dir, ['xml'], true).length).toEqual(2);
});

test('should return a array of all xml and json files from the given directory', () => {
	expect(getFiles(dir, ['xml', 'json']).length).toEqual(2);
});

test('should return a array of all xml and json files from the given directory and all sub directories', () => {
	expect(getFiles(dir, ['xml', 'json'], true).length).toEqual(4);
});

test('should not return any results when no files are matching in any files the passed extensions', () => {
	expect(getFiles(dir, ['foo'], true).length).toEqual(0);
});

test('should not return any results when no files are matching the passed extensions', () => {
	expect(getFiles(dir, ['foo']).length).toEqual(0);
});

test('should return matching results when files are matching some of the passed extensions', () => {
	expect(getFiles(dir, ['foo', 'xml']).length).toEqual(1);
});