// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 20000,
  specs: [
    './e2e/hr/**/**.spec.ts',
    // './e2e/user/requestleave/create.e2e.spec.ts',
    './e2e/account/**/**spec.ts',
    './e2e/file-manager/**/**.e2e-spec.ts',
    './e2e/email/**spec.ts',
    './e2e/accounting/accountExpense_category.e2e-spec.ts',
    './e2e/accounting/accountSettings.e2e-spec.ts',
    './e2e/accounting/cash.e2e-spec.ts',
    './e2e/accounting/customer.e2e-spec.ts',
    './e2e/accounting/bank.e2e-spec.ts',
    './e2e/accounting/card.e2e-spec.ts',
    './e2e/accounting/sales.e2e-spec.ts',
    './e2e/accounting/invoice.e2e-spec.ts',
    // './e2e/accounting/expense.e2e-spec.ts',
    // './e2e/accounting/vendor.e2e-spec.ts',
    './e2e/taskmanager/projectarole.e2e-spec.ts',
    './e2e/taskmanager/projectasettings.e2e.spec.ts',
    './e2e/taskmanager/projectboard.e2e.spec.ts',
    './e2e/taskmanager/taskboard.e2e.spec.ts',
    './e2e/taskmanager/taskpage.e2e.spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-gpu',
        '--window-size=1200,600',
        '--no-sandbox',
      //  '--headless'
      ]
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './e2e/tsconfig.e2e.json')
    });
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
