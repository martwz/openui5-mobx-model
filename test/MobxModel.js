/* global mobx, should */
sap.ui.define(['sap/ui/mobx/MobxModel', 'sap/ui/model/Context'], function (MobxModel, Context) {

  describe('Test MobxModel', function () {

    var observable;
    var model;
    
    describe('test instance constructor 1', function () {

      var nSizeLimit = 3;

      beforeEach(function () {
        observable = mobx.observable({
          array: [{val: 0}, {val: 1}, {val: 2}, {val: 3}, {val: 4}]
        });
        model = new MobxModel(observable, {sizeLimit: nSizeLimit});
      });

      it('should have size limit ' + nSizeLimit, function () {
        model.iSizeLimit.should.equal(nSizeLimit);
      });

      it('should return ' + nSizeLimit + ' contexts out of 5', function () {
        model.bindList('/array').getContexts().length.should.equal(nSizeLimit);
      });
    });

    describe('test instance constructor 2', function () {

      beforeEach(function () {
        observable = mobx.observable({
          array: [{val: 0}, {val: 1}, {val: 2}, {val: 3}, {val: 4}]
        });
        model = new MobxModel(observable, {});
      });

      it('should have size limit 100 when not set', function () {
        model.iSizeLimit.should.equal(100);
      });
    });

    beforeEach(function () {
      observable = mobx.observable({
        text: 'hello',
        arrayOfPrimitives: [
          0,
          1,
          2
        ],
        get arrayOfPrimitivesLength() {
            return this.arrayOfPrimitives.length;
        },
        nested: {
          array: [{name: 'foo'}, {name: 'bar'}]
        }
      });
      model = new MobxModel(observable);
    });

    describe('test propertybinding', function () {
      it('changing a property from one string to another directly on the observable works', function () {

        var textPropertyBinding = model.bindProperty('/text');

        var textChanged = false;
        textPropertyBinding.attachChange(function () {
          textChanged = true;
        });
        observable.text = 'changed';

        textPropertyBinding.getValue().should.equal('changed');
        textChanged.should.be.true;

      });

      it('changing the property via the binding propragates to the observable', function () {
        var propertyBinding = model.bindProperty('/text');

        propertyBinding.setValue('world');

        var newValue = mobx.computed(function () {
          return observable.text;
        }).get();

        newValue.should.equal('world');
      });
    });

    describe('test ListBinding', function(){
      it('adding an item to an array of primitives via the observable progragates to the adapter', function(){
        var listBinding = model.bindList('/arrayOfPrimitives');

        var listBindingChanged = false;

        listBinding.attachChange(function(){
          listBindingChanged = true;
        });

        observable.arrayOfPrimitives.push(3);

        listBindingChanged.should.be.true;
        listBinding.getLength().should.equal(4);

        observable.arrayOfPrimitives.slice().should.deep.equal([
          0,1,2,3
        ]);
      });

      it('changing an items value in the array of primitives', function(){
        var listBinding = model.bindList('/arrayOfPrimitives');

        var listBindingChanged;

        listBinding.attachChange(function(){
          listBindingChanged = true;
        });

        observable.arrayOfPrimitives[1] = 'changed';

        listBindingChanged.should.be.true;

        observable.arrayOfPrimitives.slice().should.deep.equal([
          0,'changed',2
        ]);
      });

      it('can get observable back', function () {
        observable.should.equal(model.getObservable());
      });

      it('can query using context', function () {
        var context = new Context(model, '/nested/array/1');
        model.getProperty('name', context).should.equal('bar');
      });
      
      it('updateBindings() method exists', function () {
        model.updateBindings(true);
        should.exist(model.updateBindings);
      });

      it('getting computed property nestedLength', function () {
        var computedPropertyBinding = model.bindProperty('/arrayOfPrimitivesLength');
        computedPropertyBinding.getValue().should.equal(3);
      });
      
      it('should set new property when using setProperty', function () {
      	var oPropVal = {nested1: {nested2: 42}};
        var success = model.setProperty('/nested/newProperty', oPropVal);
        success.should.equal(true);
        model.getProperty('/nested/newProperty/nested1/nested2').should.equal(42);
      });

      it('should set new property when using dots', function () {
      	var oPropVal = {nested3: {nested4: 421}};
        observable.nested.newPropertyDots = oPropVal;
        model.getProperty('/nested/newPropertyDots/nested3/nested4').should.equal(421);
      });

      it('should not set nonexistent property', function () {
        var success = model.setProperty('/nested/non/existent/property', 42);
        success.should.equal(false);
      });

      it('should react to new property', function () {

		should.not.exist(observable.newText);
        var textPropertyBinding = model.bindProperty('/newText');

        var textChanged = false;
        textPropertyBinding.attachChange(function () {
          textChanged = true;
        });
        // Note: observable.newText = 'initial' won't work, as expected.
        model.setProperty('/newText', 'initial');

        textPropertyBinding.getValue().should.equal('initial');
        textChanged.should.be.true;
      });
    });

  });

  return {};

}, true);