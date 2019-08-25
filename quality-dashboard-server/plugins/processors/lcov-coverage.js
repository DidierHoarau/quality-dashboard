const fse = require('fs-extra');

module.exports = {
  analyse: async reportFolder => {
    console.log(`Analysing ${reportFolder}`);

    const reportFile = `${reportFolder}/coverage/lcov-report/index.html`;
    const content = (await fse.readFile(reportFile)).toString().replace(/\n/g, '');
    const regexCoverage = /.*?^[0-9](\.[0-9]+)%.*?Statements/;
    const coverage = `${content.match(regexCoverage)[1]}%`;
    return {
      link: 'coverage/lcov-report/index.html',
      coverage
    };
  }
};
