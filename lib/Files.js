const fs = require('fs')
const path = require('path')

module.exports.Files = class {
    constructor () {
        this.files = []
    }

    isDirectory (file) {
        return fs.statSync(file).isDirectory()
    }

    get (dir, extensions = [], recursive = false) {
        const self = this
        const regexp = new RegExp('(?:.' + extensions.join('$|.') + '$)')

        this.files = []
        dir = path.isAbsolute(dir) ? path.normalize(dir) : path.resolve(process.cwd(), dir)

        if (!fs.existsSync(dir)) {
            return this.files
        }

        const pushFiles = function (dir) {
            const files = fs.readdirSync(dir)
            
            if (recursive) {
                files.forEach(file => {
                    const filepath = path.join(dir, file)

                    if (self.isDirectory(filepath)) {
                        pushFiles(filepath)
                    } else {
                        if (extensions.length) {
                            if (file.match(regexp)) {
                                self.files.push(filepath)
                            }
                        } else {
                            self.files.push(filepath)
                        }
                    }
                })
            } else {
                files.forEach(file => {
                    const filepath = path.join(dir, file)

                    const match = extensions.length ? !self.isDirectory(filepath) && file.match(regexp) : !self.isDirectory(filepath)
                    if (match) {
                        self.files.push(filepath)
                    }
                })
            }
        }

        pushFiles(dir)
        return this.files
    }
}