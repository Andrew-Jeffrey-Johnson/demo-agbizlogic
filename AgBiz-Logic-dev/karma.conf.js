module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'intl-shim'],
    files: [
      // Dependencies
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/chart.js/dist/Chart.min.js',
      'node_modules/angular-chart.js/dist/angular-chart.min.js',
      'node_modules/angular-filter/dist/angular-filter.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/intl/locale-data/jsonp/en-US.js',

      // Mock module
      'app/common/static/common/testing-mocks/mock.module.js',
      'app/common/static/common/testing-mocks/**/*.js',

      // Common module
      'app/common/static/common/common.module.js',
      'app/common/static/common/**/*.js',

      // Allocate
      'app/allocate/static/allocate/allocate.module.js',
      'app/allocate/static/allocate/**/*.js',

      // Registration module
      'app/registration/static/registration/registration.module.js',
      'app/registration/static/registration/**/*.js',

      // Budget module
      'app/budget/static/budget/budget.module.js',
      'app/budget/static/budget/**/*.js',

      // Climate module
      'app/climate/static/climate/climate.module.js',
      'app/climate/static/climate/**/*.js',

      // Scenario module
      'app/scenario/static/scenario/scenario.module.js',
      'app/scenario/static/scenario/**/*.js',

      // Dashboard module
      'app/dashboard/static/dashboard/dashboard.module.js',
      'app/dashboard/static/dashboard/**/*.js',
    ],
    exclude: [
      'app/climate/static/climate/climate-create/climate-create.component.spec.js',
      'app/climate/static/climate/tests/**/*.js',
      'app/budget/static/budget/tests/budget.scenarios.js',
      'app/scenario/static/scenario/e2e-tests/scenario.scenarios.js',
      '**/**/**/**/**.view-object.js',
      'app/common/static/common/e2e-tests/**/*.js',
      'app/scenario/static/scenario/scenario-summary/scenario-summary.component.spec.js',
      'app/scenario/static/scenario/finance-balance-sheet-year/finance-balance-sheet-year.js',
      'app/scenario/static/scenario/finance-accrual-adjustments/finance-accrual-adjustments.component.js',
      'app/scenario/static/scenario/finance-analysis-compare/finance-analysis-compare.js',
      'app/scenario/static/scenario/plan-summary/plan-summary.component.spec.js',
      'app/scenario/static/scenario/profit-summary/profit-summary.component.spec.js',
      'app/common/static/common/budget-search/budget-search.component.js',
      'app/common/static/common/budget-search/budget-search.component.spec.js',
      'app/scenario/static/scenario/finance-income-statment/finance-income-statment.component.js',
      'app/climate/static/climate/climate-summary/climate-summary.component.spec.js',
      'app/climate/static/climate/climate-summary/climate-summary.component.js',

    ],
    preprocessors: {
      'app/allocate/static/allocate/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/budget/static/budget/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/climate/static/climate/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/common/static/common/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/registration/static/registration/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/scenario/static/scenario/!(*testing-mocks)/!(*.spec).js': ['coverage'],
      'app/dashboard/static/dashboard/!(*testing-mocks)/!(*.spec).js': ['coverage'],
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      type: 'html'
    },
    client: {
        captureConsole: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    phantomjsLauncher: {
      exitOnResourceError: true,
    },
  });
};
