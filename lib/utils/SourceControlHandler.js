const NodeGit = require("nodegit")
const path = require('path')

class SourceControlHandler {
    constructor () {

    }
}

module.exports = class GitHandler extends SourceControlHandler {
    constructor () {
        super()
        this.clonedRepository
    }
    
    clone (url, localPath = path.join(__dirname, '..', '..', 'tmp'), options = {}) {
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
            } else {
                console.error("Something borked :(");
            }
        })
    }

    commit ({
        repo = this.clonedRepository,
        update_ref = 'HEAD',
        author = 'auto commit',
        committer = 'auto commit',
        message_encoding = 'utf8',
        message = 'disabled failing tests that passed the threshold',
        tree,
        parent_count,
        parents
    }) {
        console.log(NodeGit.Commit);
        
        const createCommit = (oid) => repo.createCommit(update_ref, author, committer, "message", oid);
        const commit = NodeGit.Commit.create(
            repo,
            update_ref,
            author,
            committer,
            message_encoding,
            message,
            tree,
            parent_count,
            parents
        ).then((oid, err) => {
            console.log('ppppppppee');
            
            console.log(oid, err)
            if (oid) {
                console.log('sdfsdf')
            } else {
                console.log('!!!!!!!!!!')
            }
            
        });
        console.log(commit);
        
    }
}