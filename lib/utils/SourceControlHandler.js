const NodeGit = require("nodegit")
const path = require('path')

module.exports.SourceControlHandler = class {
    constructor () {

    }
}

module.exports.gitHandler = class extends exports.SourceControlHandler {
    super () {
        this.clonedRepository
    }

    clone (url, localPath = path.join(__dirname, '..', '..', 'tmp'), options = {}) {
        this.clonedRepository = NodeGit.Clone(url, localPath, options);
        const errorAndAttemptOpen = function() {
            return NodeGit.Repository.open(localPath);
        };

        this.clonedRepository.catch(errorAndAttemptOpen).then((repository) => {
            console.log('Is the repository bare? %s', Boolean(repository.isBare()));
        })
    }

    // commit () {
    //     Commit.create(repo, update_ref, author, committer, message_encoding, message, tree, parent_count, parents).then(function(oid) {
    //     // Use oid
    //     });
    // }
}