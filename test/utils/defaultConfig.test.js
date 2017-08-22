const assert = require('assert');
const defaultConfig = require('../../lib/utils/defaultConfig.js');
const expected = {
    tests: {
        path: './tests',
        formats: ['js']
    },
    results: {
        path: 'C:/dev/temp_repo/results',
        formats: ['xml']
    },
    remote: 'https://github.com/host/repository.git',
    repoPath: 'C:/dev/temp_repo',
    maxFailures: 3
};

describe('defaultConfig', () => {
    it('should contain the expected key value pairs', () => {        
        assert.deepEqual(expected, defaultConfig);
    });
});
