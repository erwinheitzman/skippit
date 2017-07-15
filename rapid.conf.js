module.exports = () => {
    return {
        testsPath: './tests',
        results: {
            path: './tests',
            formats: ['xml']
        },
        maxFailures: 3
    }
}