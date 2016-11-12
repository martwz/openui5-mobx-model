(function () {
  'use strict';

  sap.ui.getCore().attachInit(function () {

    jQuery.sap.registerModulePath('sap/ui/model/mobx', './src');

    sap.ui.require(['sap/ui/model/mobx/MobXModel', 'sap/ui/model/json/JSONModel'], function (MobxModel, JSONmodel) {

      var observableModel = mobx.observable({
        text: 'hello',
        // _listCount: 0,
        // get listCount(){return this._listCount;},
        // set listCount(count) {this._listCount = parseInt(count);},
        nested: {
          _text:"",
          set text(text){
            if (text.toUpperCase() === 'HELLO') text = 'WORLD';
            this._listCount = text.toUpperCase();
          },
          get text() {return this._text},
          get textExpanded(){return this.listCount.split('').join('_')}
        },
        get itemsDynamic() {
          var result = [];

          for (var i = 0; i < this._listCount; i++){
            result.push({title: i});
          }
          // debugger;
          return result;
        },

        get header() {
          return this.text + ' dude!' + 'im having ' + this.itemsDynamic.length + ' items.';
        }
      });

      // mobx.reaction(function(){
      //
      //   var obj = observableModel;
      //   var path = 'observableModel.nested.textNew'.split('.');
      //
      //   while (mobx.isObservable(obj, path.pop()) && path[0]){
      //     obj = obj[path.shift()]
      //   }
      //
      //   return obj;
      // }, function(val){
      //   console.log(val);
      // });

      mobx.autorun(function(){
        console.log(mobx.toJS(observableModel.nested));
      });

      var mobxUi5Adapter = new MobxModel(observableModel);

      var binding = mobxUi5Adapter.bindProperty('/text');

      var input = new sap.m.Input({
        value: "{/text}",
        valueLiveUpdate: true
      });

      var input2 = new sap.m.Input({
        value: "{/nested/textNew}",
        valueLiveUpdate: true
      });

      var label = new sap.m.Label({
        listCount: '{/nested/textNew}'
      });

      var button = new sap.m.Button({
        listCount: "press me",
        press: function () {
        // model.setProperty('/text', 'hello');
        // observableModel.nested.text = 'awesome';
          // mobx.extendObservable(observableModel.nested, {
          //   textNew: 'asfdasd'
          // });

          observableModel.text = 'changed ';

          console.log(binding.getValue());
        // mobxUi5Adapter.setProperty('/nested/textNew', 'helloo');
        // observableModel.items.push({title: '3'});
        // data.header = 'stuff';
        // model.setProperty('/text', 'world');
      }
      });


      var list = new sap.m.List({
         headerText:"{/header}",
          items: {
          path: '/itemsDynamic',
          template: new sap.m.StandardListItem({title:'{title}'})
        }
      });


      new sap.m.VBox({
        items: [
          input,
          input2,
          label,
          button,
          list
        ]
      })
        .setModel(mobxUi5Adapter)
        .placeAt('main');
    });
  });

})();