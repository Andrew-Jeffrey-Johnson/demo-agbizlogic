exports.config = {
    framework: 'jasmine2',
    baseUrl: 'http://localhost:8000',
    suites: {
      budget: ['budget/static/budget/tests/budget.scenarios.js'],
      climate: ['climate/static/climate/tests/**/*.js'],
      scenario: ['scenario/static/scenario/e2e-tests/scenario.scenarios.js'],
      full: ['common/static/common/e2e-tests/**/*.js'],
    },
    rootElement: "[ng-app]",

    // Set the window height so all elements are exposed
    onPrepare: function() {
      browser.driver.manage().window().setSize(1200, 3000);
    }
}
