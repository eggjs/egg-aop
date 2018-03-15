const shell = require('child_process').execSync;

const package = require('../package.json');

shell(`git tag ali/${package.version}`);
shell(`git push`);
shell(`git push chair ali/${package.version}`);
