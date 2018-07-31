module.exports = function (config) {
  'use strict';

  const UI5_VERSION = '1.44.38';
  const CI_MODE = !!config.singleRun;

  config.set({
    frameworks: [
      'openui5', 'mocha', 'chai', 'chai-as-promised'
    ],
    reporters: ["mocha"].concat(CI_MODE ? 'coverage' : []),
    mochaReporter: {
      showDiff: true
    },
    coverageReporter: {
      reporters: [{type: 'lcov'}],
      subdir: browser => browser.split(' ')[0]
    },
    preprocessors: CI_MODE ? {"src/**/*.js": ["coverage"]} : {},
    files: [
      'node_modules/mobx/lib/mobx.umd.js',
      {pattern: 'src/**/*.js', included: false, served: true, watched: true},
      'test/**/*.js'
    ],
    openui5: {
      path: 'https://sapui5.hana.ondemand.com/' + UI5_VERSION + '/resources/sap-ui-core.js',
      useMockServer: false
    },
    client: {
      chai: {
        includeStack: true
      },
      mocha: {
        timeout: 100000
      },
      openui5: {
        config: {
          theme: 'sap_belize',
          resourceRoots: {
            'sap.ui.mobx': '/base/src',
            'sap.ui.mobx.test': '/base/test'
          }
        }
      }
    },
    browsers: [
      'Chrome_without_security'
    ],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security'].concat(require('is-ci') ? '--no-sandbox' : [])
      }
    }
  });
};
