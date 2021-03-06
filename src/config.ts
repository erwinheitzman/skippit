export interface Config {
	tests: {
		path: string;
		formats: Array<string>;
	},
	results: {
		path: string;
		formats: Array<string>;
	},
	maxFailures: number;
}