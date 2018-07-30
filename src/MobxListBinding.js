sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/ListBinding', './namespace'],
  function (jQuery, ChangeReason, ListBinding, namespace) {
    'use strict';

    function isNil(value) {
      return value == null;
    }

    var MobxListBinding = ListBinding.extend(namespace + '.MobxListBinding', {
      constructor: function (model, path, context, sorters, filters, params) {

        this._model = model;
        this._path = path;
        this._context = context;
        this._sorters = sorters;
        this._filters = filters;
        this._params = params;

        ListBinding.apply(this, arguments);

        this._mobxDisposer = mobx.reaction(
          function () {
            var observableArr = model.getProperty(path, context);
            if (observableArr && typeof observableArr.slice === 'function')
              return observableArr.slice();
          },
          this._fireChange.bind(this, {reason: ChangeReason.Change})
        );
      },

      destroy: function () {
        this._mobxDisposer();
        return ListBinding.prototype.destroy(this, arguments);
      },

      _getObservableArray: function () {
        return this._model.getProperty(this._path, this._context) || [];
      },

      getLength: function () {
        return this._getObservableArray().length;
      },

      getContexts: function (startIndex, sizeLimit) {

        startIndex = isNil(startIndex) ? 0 : startIndex;
        var arrLength = this._getObservableArray().length;

        if (!sizeLimit) {
          sizeLimit = this._model.iSizeLimit;
        }

        var validContextCount = Math.min(arrLength - startIndex, sizeLimit);
        if (validContextCount < 1) return [];

        var exclusiveEndIndex = startIndex + validContextCount;
        var effectiveArrPath = this._model.resolve(this._path, this._context);
        if (!(effectiveArrPath.endsWith('/'))) effectiveArrPath = effectiveArrPath + '/';

        var contexts = [];
        for (var i = startIndex; i < exclusiveEndIndex; i++) {
          contexts.push(this._model.getContext(effectiveArrPath + i));
        }
        return contexts;
      }


    });

    return MobxListBinding;

  });
