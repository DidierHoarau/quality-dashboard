const fse = require('fs-extra');

module.exports = {
  analyse: async reportFolder => {
    console.log(`Analysing ${reportFolder}`);

    const reportFile = `${reportFolder}/report.html`;
    const content = (await fse.readFile(reportFile)).toString().replace(/\n/g, '');
    const regexSummaryStr = /id=\"summary\">(.*?)<\/div>.*/;
    const summaryStr = content.match(regexSummaryStr)[1];
    const regexSummary = /.*(\d+) tests.*(\d+) passed.*(\d+) failed.*(\d+) pending.*/;
    const summary = summaryStr.match(regexSummary);
    const regexDateStr = /id=\"timestamp\">Start: (.*?)<\/div>.*/;
    const dateStr = content.match(regexDateStr)[1];
    return {
      link: 'report.html',
      success: Number(summary[3]) + Number(summary[4]),
      error: Number(summary[2]),
      total: Number(summary[1])
    };
  }
};
