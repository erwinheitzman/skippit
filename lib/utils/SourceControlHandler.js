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
        this.clonedRepository
    }
    
    disableTestsAndPushChanges (remote = this.remote, localPath = pathToRepo) {
        if (!fs.existsSync(localPath)){
            fs.mkdirSync(localPath);
        }

        const simpleGit = require('simple-git')(pathToRepo)
        
        simpleGit.clone(remote, localPath).exec(() => {
            console.log(`Cloned repository to the following path ${localPath}`)

            tests.disable()
            console.log('Disabled tests')

            simpleGit.add(['./*'])
            console.log('Git: staged changes')

            simpleGit.commit('auto commit', ['./*'])
            console.log('Git: committed changes')

            simpleGit.push('origin', 'master')
            console.log('Git: pushed changes')
        })
    }
}