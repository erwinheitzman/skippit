import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { disable } from './tests';
import { Config } from './config';

const file = resolve(process.cwd(), '.tmp/tests/todo.js');

let config: Config;
let originalState: string;

describe('disable tests of which the failure rate is equal to or greater then the maxFailures', () => {
	test('should find two matches to disable', () => {
		config.maxFailures = 1;
		expect(disableTestsAndReturnMatches().length).toEqual(2);
	});

	test('should ignore one case', () => {
		config.maxFailures = 2;
		expect(disableTestsAndReturnMatches().length).toEqual(1);
	});

	test('should ignore all cases', () => {
		config.maxFailures = 3;
		expect(disableTestsAndReturnMatches().length).toEqual(0);
	});
});

test('should throw if the results path does not exist', () => {
	config.results.path = 'non-existing';
	expect(() => disable(config)).toThrowError(`Directory ${config.results.path} does not exist`);
});

test('should throw if the tests path does not exist', () => {
	config.tests.path = 'non-existing';
	expect(() => disable(config)).toThrowError(`Directory ${config.tests.path} does not exist`);
});

beforeAll(() => {
	originalState = readFileSync(file, 'utf8');
});

beforeEach(() => {
	config = {
		tests: {
			path: resolve(process.cwd(), '.tmp/tests'),
			formats: ['js']
		},
		results: {
			path: resolve(process.cwd(), '.tmp/results'),
			formats: ['json']
		},
		maxFailures: 0,
		remote: '',
		repoPath: ''
	};
});

afterEach(() => {
	writeFileSync(file, originalState, 'utf8');
});

function disableTestsAndReturnMatches() {
	disable(config);
	return readFileSync(file, 'utf8').match(/[it|test].skip/g) || [];
}