const fs = require('fs');
const path = require('path');
const config = require('./getConfig');
const Tests = require('../Tests');
const simpleGit = require('simple-git')();

class SourceControlHandler {
    constructor () {
        this.remote = config.remote;
        this.pathToRepo = path.isAbsolute(config.repoPath)
            ? path.normalize(config.repoPath)
            : path.resolve(process.cwd(), config.repoPath);
    }
}

class GitHandler extends SourceControlHandler {
    constructor () {
        super();
    }

    logSuccesThenProcessChanges (callback) {
        console.info('SkippyIO: Disabled tests');

        simpleGit
            .add(['./*'])
            .commit('auto commit', ['./*'])
            .push('origin', 'master', () => {
                console.info('Git: pushed changes');

                callback();
            });
    }

    logSuccessThenDisableTests (callback) {
        const self = this;

        console.info(`Cloned/Updated repository at:  ${self.pathToRepo}`);

        Tests.disable(() => {
            self.logSuccesThenProcessChanges(callback);
        });
    }

    cloneRepoThenPushChanges (callback) {
        const self = this;

        if (!fs.existsSync(self.pathToRepo)) {
            fs.mkdirSync(self.pathToRepo);

            simpleGit.cwd(self.pathToRepo);
        
            simpleGit.clone(self.remote, self.pathToRepo)
                .exec(() => self.logSuccessThenDisableTests(callback));
        } else {
            simpleGit.pull()
                .exec(() => self.logSuccessThenDisableTests(callback));
        }
    }
}

module.exports.sourceControlHandler = new SourceControlHandler();
module.exports.gitHandler = new GitHandler();
