sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', 'sap/ui/model/Context', './MobxListBinding', './MobxPropertyBinding', './namespace'],
  function (jQuery, AbstractModel, Context, MobxListBinding, MobxPropertyBinding, namespace) {
    'use strict';

    function isNil(value) {
      return value == null;
    }

    var MobxModel = AbstractModel.extend(namespace + '.MobxModel', {

      constructor: function (observable) {

        mobx.extendObservable(this, {
            _observable: observable || {}
        });

        AbstractModel.apply(this, arguments);
        // Parent class sap.ui.model.Model has a default size limitation of 100 entries
        // which may and does cause problems. 
        this.setSizeLimit(Number.MAX_SAFE_INTEGER);
      },
      getObservable: function () {
        return this._observable;
      },
      setObservable: function (observable) {
        this._observable = observable;
      },
      // ALIAS
      getData: function () { return this.getObservable(); },
      setData: function (observable) { this.setObservable(observable); },
      bindProperty: function (sPath, oContext, mParameters) {
        return new MobxPropertyBinding(this, sPath, oContext, mParameters);
      },
      bindList: function (sPath, oContext, aSorters, aFilters, mParameters) {
        return new MobxListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
      },
      setProperty: function (path, value, context, bAsyncUpdate) {
        var resolvedPath = this.resolve(path, context);

        // return if path / context is invalid
        if (!resolvedPath) {
          return false;
        }
        // If data is set on root, call setData instead
        if (resolvedPath === '/') {
          throw new Error('invariant: setting a new root object (observable) "/" after constructing the model is not yet supported in MobxModel');
          // this.setData(value);
          // return true;
        }

        var iLastSlash = resolvedPath.lastIndexOf('/');
        var property = resolvedPath.substring(iLastSlash + 1);

        var node = iLastSlash === 0 ? this._observable : this._getNode(resolvedPath.substring(0, iLastSlash));
        if (node) {
          node[property] = value;
          return true;
        }
        return false;
      },
      getProperty: function (sPath, oContext) {
        return this._getNode(sPath, oContext);
      },
      _getNode: function (path, context) {

        var resolvedPath = this.resolve(path, context);
        if (isNil(resolvedPath)) return null;

        var parts = resolvedPath.substring(1).split('/');

        var currentNode = this._observable;

        var partsLength = parts.length;
        for (var i = 0; i < partsLength && !isNil(currentNode); i++) {
          currentNode = currentNode[parts[i]];
        }

        return currentNode;
      }
    });

    return MobxModel;

  });
