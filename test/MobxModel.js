sap.ui.define(
  ['sap/ui/mobx/MobxModel', 'sap/ui/model/Context'],
  function(MobxModel, Context) {
    describe('Test MobxModel', function() {
      var observable;
      var model;

      describe('test instance constructor', function() {
        var nSizeLimit = 3;

        beforeEach(function() {
          observable = mobx.observable({
            array: [{ val: 0 }, { val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }],
          });
          model = new MobxModel(observable, { sizeLimit: nSizeLimit });
        });

        it('model iSizeLimit is set to ' + nSizeLimit, function() {
          model.iSizeLimit.should.equal(nSizeLimit);
        });

        it('getContexts() returns ' + nSizeLimit + ' contexts out of 5', function() {
          model
            .bindList('/array')
            .getContexts()
            .length.should.equal(nSizeLimit);
        });
      });

      beforeEach(function() {
        observable = mobx.observable({
          text: 'hello',
          arrayOfPrimitives: [0, 1, 2],
          nested: {
            array: [{ name: 'foo' }, { name: 'bar' }],
          },
        });
        model = new MobxModel(observable);
      });

      describe('test propertybinding', function() {
        it('changing a property from one string to another directly on the observable works', function() {
          var textPropertyBinding = model.bindProperty('/text');

          var textChanged = false;
          textPropertyBinding.attachChange(function() {
            textChanged = true;
          });
          observable.text = 'changed';

          textPropertyBinding.getValue().should.equal('changed');
          textChanged.should.be.true;
        });

        it('changing the property via the binding propragates to the observable', function() {
          var propertyBinding = model.bindProperty('/text');

          propertyBinding.setValue('world');

          var newValue = mobx
            .computed(function() {
              return observable.text;
            })
            .get();

          newValue.should.equal('world');
        });
      });

      describe('test ListBinding', function() {
        it('adding an item to an array of primitives via the observable progragates to the adapter', function() {
          var listBinding = model.bindList('/arrayOfPrimitives');

          var listBindingChanged = false;

          listBinding.attachChange(function() {
            listBindingChanged = true;
          });

          observable.arrayOfPrimitives.push(3);

          listBindingChanged.should.be.true;
          listBinding.getLength().should.equal(4);

          observable.arrayOfPrimitives.slice().should.deep.equal([0, 1, 2, 3]);
        });

        it('changing an items value in the array of primitives', function() {
          var listBinding = model.bindList('/arrayOfPrimitives');

          var listBindingChanged;

          listBinding.attachChange(function() {
            listBindingChanged = true;
          });

          observable.arrayOfPrimitives[1] = 'changed';

          listBindingChanged.should.be.true;

          observable.arrayOfPrimitives.slice().should.deep.equal([0, 'changed', 2]);
        });

        it('can get observable back', function() {
          observable.should.equal(model.getObservable());
        });

        it('can query using context', function() {
          var context = new Context(model, '/nested/array/1');
          model.getProperty('name', context).should.equal('bar');
        });
      });
    });

    return {};
  },
  true
);
