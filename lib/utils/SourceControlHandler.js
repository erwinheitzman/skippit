const fs = require('fs');
const path = require('path');
const config = require('./getConfig');
const Tests = require('../Tests');
const simpleGit = require('simple-git')();

class SourceControlHandler {
    constructor () {
        this.remote = config.remote;
    }
}

class GitHandler extends SourceControlHandler {
    constructor () {
        super();
    }

    disableTestsAndPushChanges (callback) {
        const pathToRepo = path.isAbsolute(config.repoPath)
            ? path.normalize(config.repoPath)
            : path.resolve(process.cwd(), config.repoPath);

        if (!fs.existsSync(pathToRepo)) {
            fs.mkdirSync(pathToRepo);
        }

        simpleGit.cwd(pathToRepo);

        simpleGit.clone(this.remote, pathToRepo, () => {
            console.info(`Cloned repository at:  ${pathToRepo}`);

            Tests.disable(() => {
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
}

module.exports.sourceControlHandler = new SourceControlHandler();
module.exports.gitHandler = new GitHandler();
