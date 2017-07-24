const NodeGit = require("nodegit")
const path = require('path')
const { ConfigParser } = require('./ConfigParser')
const configParser = new ConfigParser
configParser.addConfig(path.resolve(__dirname, '..', '..', './config.json'))
const { tests } = configParser.config

class SourceControlHandler {
    constructor () {

    }
}

module.exports = class GitHandler extends SourceControlHandler {
    constructor () {
        super()
        this.clonedRepository
    }
    
    clone (url = configParser.config.url, localPath = path.join(__dirname, '..', '..', 'tmp'), options = {}) {
        const self = this;

        // TODO: remove default form localPath
        this.clonedRepository = NodeGit.Clone(url, localPath, options);
        const errorAndAttemptOpen = function() {
            return NodeGit.Repository.open(localPath);
        };

        this.clonedRepository.catch(errorAndAttemptOpen).then(repository => {
            if (repository instanceof NodeGit.Repository) {
                console.info("We cloned the repo!");
                const Tests = require('../Tests').Tests
                const tests = new Tests
                tests.disable()
                
                self.commit({})
                // self.push()
            } else {
                console.error("Something borked :(");
            }
        })
    }

    commit () {
        let repo;
        let index;
        let oid;

        NodeGit.Repository.open(path.resolve(__dirname, "../../tmp/.git"))
            .then(repoResult => { repo = repoResult })
            .then(() => repo.refreshIndex())
            .then(indexResult => { index = indexResult })
            .then(() => index.addByPath('tests/moreTests/andMore/tests2.js'))
            .then(() => index.write())
            .then(() => index.writeTree())
            .then((oidResult) => {
                oid = oidResult
                return NodeGit.Reference.nameToId(repo, "HEAD")
            })
            .then(head => repo.getCommit(head))
            .then(parent => {
                const author = NodeGit.Signature.create("Scott Chacon",
                    "schacon@gmail.com", 123456789, 60)
                const committer = NodeGit.Signature.create("Scott A Chacon",
                    "scott@github.com", 987654321, 90)

                return repo.createCommit("HEAD", author, committer, "message", oid, [parent])
            })
            .done(commitId => { console.log("New Commit: ", commitId) })
    }

    push () {
        NodeGit.Remote.create(this.clonedRepository, "origin", "https://github.com/erwinheitzman/selenium-build-monitor.git")
            .then(remoteResult => {
                remote = remoteResult;

                // Create the push object for this remote
                return remote.push(["refs/heads/v0.2:refs/heads/v0.2"]);
            }).done(() => {
                console.log("Done!");
            });
    }


    // commit ({
    //     repo = this.clonedRepository,
    //     update_ref = 'HEAD',
    //     author = 'auto commit',
    //     committer = 'auto commit',
    //     message_encoding = 'utf8',
    //     message = 'disabled failing tests that passed the threshold',
    //     tree,
    //     parent_count,
    //     parents
    // }) {
    //     console.log(path.join(process.cwd(), './tmp/tests/moreTests/andMore/tests2.js'));
        
    //     repo.createCommitOnHead([path.join(process.cwd(), './tmp/tests/moreTests/andMore/tests2.js')], author, committer, message).then((oid, err) => {
    //         console.log('sdfsdfs');
            
    //     })
    // //     const createCommit = (oid) => repo.createCommit(update_ref, author, committer, "message", oid);
    // //     const commit = NodeGit.Commit.create(
    // //         repo,
    // //         update_ref,
    // //         author,
    // //         committer,
    // //         message_encoding,
    // //         message,
    // //         tree,
    // //         parent_count,
    // //         parents
    // //     ).then((oid, err) => {
    // //         console.log('ppppppppee');
            
    // //         console.log(oid, err)
    // //         if (oid) {
    // //             console.log('sdfsdf')
    // //         } else {
    // //             console.log('!!!!!!!!!!')
    // //         }
            
    // //     });
    // //     console.log(commit);
        
    // }
}