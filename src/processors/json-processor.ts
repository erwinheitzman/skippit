import { readFileSync } from 'fs';

type Files = Array<string>;

interface Test {
	name: string;
	start: string;
	end: string;
	duration: number;
	state: string;
}

export interface FailedTests {
	[key: string]: number;
}

export function readFiles(files: Files): Array<string> {
	return files.map((file) => readFileSync(file, 'utf8'));
}

export function processFiles(files: Files): FailedTests {
	const failedTests: FailedTests = {};

	files.forEach((content): void => {
		const { suites } = JSON.parse(content);

		if (!suites) {
			return;
		}

		suites.forEach((suite: { tests: Array<Test> }) => {
			if (!suite.tests) {
				return;
			}

			suite.tests.forEach(({ name, state }) => {
				const failed = state === 'fail' || state === 'failed';

				if (!failed) {
					return;
				}

				if (!failedTests[name]) {
					failedTests[name] = 1;
				} else {
					failedTests[name]++;
				}
			});
		});
	});

	return failedTests;
}
