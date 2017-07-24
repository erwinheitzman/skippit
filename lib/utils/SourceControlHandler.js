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

    }
}

module.exports = class GitHandler extends SourceControlHandler {
    constructor () {
        super()
        this.clonedRepository
    }
    
    disableTestsAndPushChanges (url = configParser.config.url, localPath = pathToRepo) {
        if (!fs.existsSync(localPath)){
            fs.mkdirSync(localPath);
        }

        const simpleGit = require('simple-git')(pathToRepo)
        
        simpleGit.clone(url, localPath)
            .exec(() => {
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

// module.exports = class GitHandler extends SourceControlHandler {
//     constructor () {
//         super()
//         this.clonedRepository
//         this.pathToRepo = path.join(__dirname, '..', '..', 'tmp')
//     }
    
//     clone (url = configParser.config.url, localPath = this.pathToRepo, options = {}) {
//         const self = this;

//         // TODO: remove default form localPath
//         this.clonedRepository = NodeGit.Clone(url, localPath, options);
//         const errorAndAttemptOpen = function() {
//             return NodeGit.Repository.open(localPath);
//         };

//         this.clonedRepository.catch(errorAndAttemptOpen).then(repository => {
//             if (repository instanceof NodeGit.Repository) {
//                 console.info("We cloned the repo!");
//                 const Tests = require('../Tests').Tests
//                 const tests = new Tests
//                 tests.disable()
                
//                 self.commit({})
//                 // self.push()
//             } else {
//                 console.error("Something borked :(");
//             }
//         })
//     }

//     commit () {
//         let repo;
//         let index;
//         let oid;

//         NodeGit.Repository.open(this.pathToRepo)
//             .then(repoResult => { repo = repoResult })
//             .then(() => repo.refreshIndex())
//             .then(indexResult => { index = indexResult })
//             .then(() => index.addByPath('tests/moreTests/andMore/tests2.js'))
//             .then(() => index.write())
//             .then(() => index.writeTree())
//             .then((oidResult) => {
//                 oid = oidResult
//                 return NodeGit.Reference.nameToId(repo, "HEAD")
//             })
//             .then(head => repo.getCommit(head))
//             .then(parent => {
//                 const author = NodeGit.Signature.create("Scott Chacon",
//                     "schacon@gmail.com", 123456789, 60)
//                 const committer = NodeGit.Signature.create("Scott A Chacon",
//                     "scott@github.com", 987654321, 90)

//                 return repo.createCommit("HEAD", author, committer, "message", oid, [parent])
//             })
//             .done(commitId => { console.log("New Commit: ", commitId) })
//     }

//     push () {
//         NodeGit.Remote.create(this.clonedRepository, "origin", "https://github.com/erwinheitzman/selenium-build-monitor.git")
//             .then(remoteResult => {
//                 remote = remoteResult;

//                 // Create the push object for this remote
//                 return remote.push(["refs/heads/v0.2:refs/heads/v0.2"]);
//             }).done(() => {
//                 console.log("Done!");
//             });
//     }
// }