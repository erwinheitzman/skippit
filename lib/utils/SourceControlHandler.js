const fs = require('fs')
const path = require('path')

const { ConfigParser } = require('./ConfigParser')
const configParser = new ConfigParser
configParser.addConfig(path.resolve(__dirname, '..', '..', './config.json'))

const Tests = require('../Tests').Tests
const tests = new Tests

const pathToRepo = path.isAbsolute(configParser.config.repoPath) ?
    path.normalize(configParser.config.repoPath) :
    path.resolve(process.cwd(), configParser.config.repoPath)

class SourceControlHandler {
    constructor () {
        this.remote = configParser.config.remote
    }
}

module.exports = class GitHandler extends SourceControlHandler {
    constructor () {
        super()
    }
    
    disableTestsAndPushChanges (callback) {
        if (!fs.existsSync(pathToRepo)){
            fs.mkdirSync(pathToRepo);
        }

        const simpleGit = require('simple-git')(pathToRepo)

        simpleGit.clone(this.remote, pathToRepo, () => {
            console.log(`Cloned repository at:  ${pathToRepo}`)

            tests.disable(() => {
                console.log('SkippyIO: Disabled tests')

                simpleGit
                    .add(['./*'])
                    .commit('auto commit', ['./*'])
                    .push('origin', 'master', () => {
                        console.log('Git: pushed changes')

                        callback()
                    })
            })
        })
    }
}