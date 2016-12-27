sap.ui.define(['sap/ui/model/mobx/MobxModel'], function (MobxAdapter) {

  describe('A suite', function () {

    var observable;
    var adapter;

    beforeEach(function () {
      observable = mobx.observable({
        text: 'hello',
        arrayOfPrimitives: [
          0,
          1,
          2
        ]
      });
      adapter = new MobxAdapter(observable);
    });

    describe('test the basics', function () {

      it('throws a TypeError if the constructor gets passed a non-observable', function () {
        expect(function () {new MobxAdapter({})}).toThrowError(TypeError);
      });

    });

    describe('test propertybinding', function () {
      it('changing a property from one string to another directly on the observable works', function () {

        var textPropertyBinding = adapter.bindProperty('/text');

        var textChanged = false;
        textPropertyBinding.attachChange(function () {
          textChanged = true;
        });
        observable.text = 'changed';

        expect(textPropertyBinding.getValue()).toBe('changed');
        expect(textChanged).toBe(true);

      });

      it('changing the property via the binding propragates to the observable', function () {
        var propertyBinding = adapter.bindProperty('/text');

        propertyBinding.setValue('world');

        var newValue = mobx.computed(function () {
          return observable.text;
        }).get();

        expect(newValue).toBe('world');
      });
    });

    describe('test ListBinding', function(){
      it('adding an item to an array of primitives via the observable progragates to the adapter', function(){
        var listBinding = adapter.bindList('/arrayOfPrimitives');

        var listBindingChanged;

        listBinding.attachChange(function(){
          listBindingChanged = true;
        });

        observable.arrayOfPrimitives.push(3);

        expect(listBindingChanged).toBe(true);
        expect(listBinding.getLength()).toEqual(4);

        expect(observable.arrayOfPrimitives.slice()).toEqual([
          0,1,2,3
        ]);
      });

      it('changing an items value in the array of primitives', function(){
        var listBinding = adapter.bindList('/arrayOfPrimitives');

        var listBindingChanged;

        listBinding.attachChange(function(){
          listBindingChanged = true;
        });

        observable.arrayOfPrimitives[1] = 'changed';

        expect(listBindingChanged).toBe(true);

        expect(observable.arrayOfPrimitives.slice()).toEqual([
          0,'changed',2
        ]);
      })


    })

  });

  return {};

}, true);