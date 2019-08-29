// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: [
		"text",
		"lcov",
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		},
	},

	// A path to a module which exports an async function that is triggered once before all test suites
	// globalSetup: null,

	// A path to a module which exports an async function that is triggered once after all test suites
	// globalTeardown: null,

	moduleFileExtensions: [
		"js",
		"json",
	],

	// Use this configuration option to add custom reporters to Jest
	// reporters: undefined,

	// Automatically reset mock state between every test
	// resetMocks: false,

	// Reset the module registry before running each individual test
	// resetModules: false,

	roots: [
		"dist"
	],

	// The paths to modules that run some code to configure or set up the testing environment before each test
	// setupFiles: [],

	// A list of paths to modules that run some code to configure or set up the testing framework before each test
	// setupFilesAfterEnv: [],

	// A list of paths to snapshot serializer modules Jest should use for snapshot testing
	// snapshotSerializers: [],

	// The test environment that will be used for testing
	testEnvironment: "node",

	// Options that will be passed to the testEnvironment
	// testEnvironmentOptions: {},
};
