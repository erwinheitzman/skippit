const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');

const defaultConfig = {
    tests: {
        path: [],
        formats: []
    },
    results: {
        path: [],
        formats: []
    },
    remote: [],
    repoPath: [],
    maxFailures: []
};

const configPath = path.join(__dirname, '../../config');
const configToMerge = fs.existsSync(configPath) && require(configPath);
const config = merge(defaultConfig, configToMerge || {});

module.exports = config;