module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    setupFiles: ['./jest/setEnvVars.js'],
    testEnvironment: 'node',
    testRegex: 'spec.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
