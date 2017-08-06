const fs = require('fs');
const path = require('path');
const config = require('./getConfig');
const Tests = require('../Tests').Tests;
const tests = new Tests();

const pathToRepo = path.isAbsolute(config.repoPath)
    ? path.normalize(config.repoPath)
    : path.resolve(process.cwd(), config.repoPath);

class SourceControlHandler {
    constructor () {
        this.remote = config.remote;
    }
}

module.exports = class GitHandler extends SourceControlHandler {
    constructor () {
        super();
    }

    disableTestsAndPushChanges (callback) {
        if (!fs.existsSync(pathToRepo)) {
            fs.mkdirSync(pathToRepo);
        }

        const simpleGit = require('simple-git')(pathToRepo);

        simpleGit.clone(this.remote, pathToRepo, () => {
            console.info(`Cloned repository at:  ${pathToRepo}`);

            tests.disable(() => {
                console.info('SkippyIO: Disabled tests');

                simpleGit
                    .add(['./*'])
                    .commit('auto commit', ['./*'])
                    .push('origin', 'master', () => {
                        console.info('Git: pushed changes');

                        callback();
                    });
            });
        });
    }
};
