const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const config = existsSync('../config') ? require('../config') : null;
const Tests = require('../Tests');
const simpleGit = require('simple-git')();

class SourceControlHandler {
    constructor () {
        this.pardsedRepoPath = null;
    }
}

class GitHandler extends SourceControlHandler {
    constructor () {
        super();
        this.status = null;
    }

    cloneRepoThenPushChanges (callback, settings = config) {
        const self = this;
        const parsePath = opts => path.isAbsolute(opts.repoPath)
            ? path.normalize(opts.repoPath)
            : path.resolve(process.cwd(), opts.repoPath);
        const logMessageThenDisableTests = msg => {
            console.info(msg);
            // eslint-disable-next-line
            Tests.disable(() => {}, settings);
        };

        self.pardsedRepoPath = parsePath(settings);

        if (!existsSync(self.pardsedRepoPath)) {
            mkdirSync(self.pardsedRepoPath);

            simpleGit
                .cwd(self.pardsedRepoPath)
                .clone(settings.remote, self.pardsedRepoPath)
                .exec(() => logMessageThenDisableTests('Cloned repository'))
                .diffSummary((err, status) => {
                    if (err) {
                        throw new Error(err);
                    }
                    console.info('Disabled ' + status.insertions + ' tests');
                })
                .diff((err, status) => {
                    if (err) {
                        throw new Error(err);
                    }
                    self.status = status;
                });
        } else {
            simpleGit
                .cwd(self.pardsedRepoPath)
                .reset('hard')
                .pull(settings.remote)
                .exec(() => logMessageThenDisableTests('Updated repository'))
                .diffSummary((err, status) => {
                    if (err) {
                        throw new Error(err);
                    }
                    console.info('Disabled ' + status.insertions + ' tests');
                })
                .diff((err, status) => {
                    if (err) {
                        throw new Error(err);
                    }
                    self.status = status;
                });
        }
    }
}

module.exports.sourceControlHandler = new SourceControlHandler();
module.exports.gitHandler = new GitHandler();
