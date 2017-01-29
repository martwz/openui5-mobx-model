(function () {
  'use strict';

  sap.ui.getCore().attachInit(function () {

    sap.ui.require(['sap/ui/model/mobx/MobXModel'], function (MobxModel) {

      var stateStore = mobx.observable({
        text: 'hello',
        _listCount: 0,
        get listCount() {return this._listCount;},
        set listCount(count) {this._listCount = parseInt(count);},
        nested: {
          _text: "",
          set text(text) {
            if (text.toUpperCase() === 'HELLO') text = 'WORLD';
            this._listCount = text.toUpperCase();
          },
          get text() {return this._text}
        },
        get items() {
          var result = [{title: 'bla'}];
          for (var i = 0; i < this._listCount; i++) {
            result.push({title: 'hello'});
          }
          return result;
        },

        get header() {
          return this.text + ' dude!' + 'im having ' + this.items.length + ' items.';
        }
      });

      var mobxUi5Adapter = new MobxModel(stateStore);

      mobxUi5Adapter.getProperty('/items/0');

      var input = new sap.m.Input({
        value: "{/text}",
        valueLiveUpdate: true
      });

      var button = new sap.m.Button({
        text: "press me",
        press: function () {
          stateStore.text = 'changed ';
          stateStore.listCount++;
        }
      });


      var list = new sap.m.List({
        headerText: "{/header}",
        items: {
          path: '/items',
          template: new sap.m.StandardListItem({title: '{title}'})
        }
      });

      new sap.m.VBox({
        items: [
          input,
          button,
          list
        ]
      })
        .setModel(mobxUi5Adapter)
        .placeAt('main');
    });
  });

})();