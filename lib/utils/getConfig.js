const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const defaultConfig = require('./defaultConfig.js');
const configPath = path.join(__dirname, '../../config.json');
const configToMerge = fs.existsSync(configPath) ? require(configPath) : false;
const config = merge(defaultConfig, configToMerge || {});

module.exports = config;
