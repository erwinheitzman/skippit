import { command, version, help, parse } from 'commander';
import { prompt } from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Config } from '../config';
import { disable } from '../tests';

const CONFIG_PATH = resolve(process.cwd(), 'config.json');
const SUPPORTED_RESULT_FORMATS = ['json', 'xml'];
const SUPPORTED_TEST_FORMATS = ['e2e-spec.js', 'spec.js', 'test.js', 'js'];

const ERRORS = {
	PATH_NOT_EXISTING: 'path does not exist',
	EMPTY_FORMAT: 'choose a format',
	NOT_INT: 'answer must be an integer',
	IS_NEGATIVE: 'answer must be a positive number',
	IS_ZERO: 'answer cannot be zero',
};

const CONFIG_QUESTIONS = [
	{
		type: 'input',
		name: 'resultPath',
		message: 'Where are your test results located?',
		default: './reports',
		validate: (answer: string): boolean | string => existsSync(answer) || ERRORS.PATH_NOT_EXISTING,
	},
	{
		type: 'checkbox',
		name: 'resultFormats',
		message: 'Which reporter formats do you want to use?',
		choices: SUPPORTED_RESULT_FORMATS,
		default: ['json'],
		validate: (answers: Array<string>): boolean | string => answers.length > 0 || ERRORS.EMPTY_FORMAT,
	},
	{
		type: 'input',
		name: 'testPath',
		message: 'Where are your test files located?',
		default: './tests',
		validate: (answer: string): boolean | string => existsSync(answer) || ERRORS.PATH_NOT_EXISTING,
	},
	{
		type: 'checkbox',
		name: 'testFormats',
		message: 'Which test formats do you want to use?',
		choices: SUPPORTED_TEST_FORMATS,
		default: ['spec.js'],
		validate: (answers: Array<string>): boolean | string => answers.length > 0 || ERRORS.EMPTY_FORMAT,
	},
	{
		type: 'input',
		name: 'maxFailures',
		message: 'Max failures treshhold',
		default: '3',
		validate: (answer: string): boolean | string => {
			const isNotInt = !Number.isInteger(parseInt(answer, 10));

			if (isNotInt) {
				return ERRORS.NOT_INT;
			}

			const isNegative = parseInt(answer, 10) < 0;

			if (isNegative) {
				return ERRORS.IS_NEGATIVE;
			}

			const isZero = parseInt(answer, 10) === 0;

			if (isZero) {
				return ERRORS.IS_ZERO;
			}

			return true;
		},
	},
];

interface Answers {
	testPath: string;
	testFormats: Array<string>;
	resultPath: string;
	resultFormats: Array<string>;
	remotePath: string;
	repoPath: string;
	maxFailures: string;
}

function answersToConfig(answers: Answers): Config {
	return {
		tests: {
			path: answers.testPath,
			formats: answers.testFormats,
		},
		results: {
			path: answers.resultPath,
			formats: answers.resultFormats,
		},
		maxFailures: parseInt(answers.maxFailures, 10),
	};
}

async function configCommand(): Promise<void> {
	if (existsSync(CONFIG_PATH)) {
		const answer = await prompt({
			type: 'confirm',
			name: 'overwriteConfig',
			message: 'Config file already exists are you sure you want to overwrite this?',
			default: false,
		});

		if (!answer.overwriteConfig) {
			return;
		}
	}

	const answers = await prompt(CONFIG_QUESTIONS) as Answers;
	const config = answersToConfig(answers);

	writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf8');
}

async function disableCommand(): Promise<void> {
	let configAnswers;

	if (!existsSync(CONFIG_PATH)) {
		configAnswers = answersToConfig(await prompt(CONFIG_QUESTIONS))
	}

	const { shouldDisableTests } = await prompt({
		type: 'confirm',
		name: 'shouldDisableTests',
		message: 'Are you sure you want to disable all matching tests that exceed the threshold?',
	});

	if (shouldDisableTests) {
		if (configAnswers) {
			disable(configAnswers as Config);
			return;
		}

		disable(await import(CONFIG_PATH));
	}
}

version(require(resolve(process.cwd(), 'package.json')).version)
	.description('CLI for programmatically disabling tests');

command('disable')
	.alias('d')
	.description('Disable tests')
	.action(disableCommand);

command('config')
	.alias('c')
	.description('Create config')
	.action(configCommand);

command('help')
	.alias('h')
	.description('Get help')
	.action(() => help());

parse(process.argv);
