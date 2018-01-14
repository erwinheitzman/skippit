const { statSync, existsSync, readdirSync } = require('fs');
const { join, isAbsolute, normalize, resolve } = require('path');

class Files {
    constructor () {
        this.files = [];
    }

    isDirectory (file) {
        return statSync(file).isDirectory();
    }

    get (dir, extensions = [], recursive = false) {
        const self = this;
        const regexp = new RegExp('(?:.' + extensions.join('$|.') + '$)');

        this.files = [];
        const parsedPath = isAbsolute(dir)
            ? normalize(dir)
            : resolve(process.cwd(), dir);

        if (!existsSync(dir)) {
            return this.files;
        }

        const pushFiles = function (fullPath) {
            const files = readdirSync(fullPath);

            if (recursive) {
                files.forEach(file => {
                    const filepath = join(fullPath, file);

                    if (self.isDirectory(filepath)) {
                        pushFiles(filepath);
                    } else if (extensions.length) {
                        if (file.match(regexp)) {
                            self.files.push(filepath);
                        }
                    } else {
                        self.files.push(filepath);
                    }
                });
            } else {
                files.forEach(file => {
                    const filepath = join(fullPath, file);

                    const match = extensions.length
                        ? !self.isDirectory(filepath) && file.match(regexp)
                        : !self.isDirectory(filepath);

                    if (match) {
                        self.files.push(filepath);
                    }
                });
            }
        };

        pushFiles(parsedPath);

        return this.files;
    }
}

module.exports = new Files();
