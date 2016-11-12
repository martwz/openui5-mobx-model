module.exports = function () {
  return {
    testFramework: 'jasmine',
    files: [
      {pattern: 'node_modules/mobx/lib/mobx.umd.min.js', instrument: false, load: true},
      {pattern: 'maven_packages/sapui5/resources/sap-ui-core.js', instrument: false, load: true},
      {pattern: 'src/**/*.js', instrument: true, load: false}
    ],
    tests: [
      {pattern: 'test/**/*.js', load: false}
    ],
    middleware: (app, express) => {
      app.use('/maven_packages', express.static(require('path').join(__dirname, 'maven_packages')));
    },
    env: {
      type: 'browser',
      kind: 'electron'
    },
    debug: true,
    setup: function (wallaby) {
      wallaby.delayStart();

      jQuery.sap.registerModulePath('sap/ui/model/mobx', './src');
      jQuery.sap.registerModulePath('sap/ui/model/mobx/test', './test');

      sap.ui.getCore().attachInit(function () {

        jQuery.sap.require('sap/ui/model/mobx/test/MobxModel');

        wallaby.start();

        // Promise.all(wallaby.tests.map(url => jQuery.sap.includeScript({url})))
        //   .then(() => wallaby.start())
        //   .catch(e => console.error(e));
      })
    }
  };
};