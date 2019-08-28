module.exports = {
  analyse: async reportFolder => {
    console.log(`Analysing ${reportFolder}`);
    return {
      link: 'report.html',
      success: 0,
      warning: 0,
      error: 0,
      total: 0,
      coverage: '0%'
    };
  }
};
