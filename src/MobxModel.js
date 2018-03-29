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
          mobx.set(node, property, value);
    	  // Pre-4.0.0, TODO: removeme
          //// MobX will not react to observable properties that did not exist when tracking started.
          //// If any other observable causes the autorun to re-run, the autorun will start tracking the postDate as well.
          //if (!(property in node) && mobx.isObservableObject(node)) {
          //	var oExt = {};
          //	oExt[property] = value;
          //	mobx.extendObservable(node, oExt);
          //} else {
          //  node[property] = value;
          //}
          return true;
        }
        return false;
      },
      getProperty: function (sPath, oContext) {
        return this._getNode(sPath, oContext);
      },
      updateBindings: function(bForceUpdate) {
      	jQuery.sap.log.info("MobxModel.updateBindings(" + bForceUpdate + ") was called");
      	if(bForceUpdate) {
      		this.checkUpdate(bForceUpdate);
      	}
      },
      _getNode: function (path, context) {

        var resolvedPath = this.resolve(path, context);
        if (isNil(resolvedPath)) return null;

        var parts = resolvedPath.substring(1).split('/');

        var currentNode = this._observable;

        var partsLength = parts.length;
        for (var i = 0; i < partsLength && !isNil(currentNode); i++) {

		  // Check for out of bounds array index access to suppress warnings
		  //	"[mobx.array] Attempt to read an array index (1) that is out of bounds (1). Please check length first. Out of bound indices will not be tracked by MobX"
          if (!mobx.isObservableArray(currentNode) || parts[i] < currentNode.length) {
          	// Pre-4.0.0, TODO: removeme
        	// currentNode = currentNode[parts[i]];
        	currentNode = mobx.get(currentNode, parts[i]);
          } else {
          	currentNode = null;
          }
        }

        return currentNode;
      }
    });

    return MobxModel;

  });