/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * JSON-based DataBinding
 *
 * @namespace
 * @name sap.ui.model.json
 * @public
 */

// Provides the JSON object based model implementation
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', 'sap/ui/model/Context', 'sap/ui/model/mobx/MobXListBinding', 'sap/ui/model/mobx/MobXPropertyBinding', 'sap/ui/model/json/JSONTreeBinding'],
  function(jQuery, AbstractModel, Context, MobxListBinding, MobxPropertyBinding, JSONTreeBinding) {
    "use strict";


    /**
     * Constructor for a new JSONModel.
     *
     * @class
     * Model implementation for JSON format
     *
     * The observation feature is experimental! When observation is activated, the application can directly change the
     * JS objects without the need to call setData, setProperty or refresh. Observation does only work for existing
     * properties in the JSON, it can not detect new properties or new array entries.
     *
     * @extends sap.ui.model.ClientModel
     *
     * @author SAP SE
     * @version 1.42.0
     *
     * @param {object} oData either the URL where to load the JSON from or a JS object
     * @param {boolean} bObserve whether to observe the JSON data for property changes (experimental)
     * @constructor
     * @public
     * @alias sap.ui.model.json.JSONModel
     */
    var MobxModel = AbstractModel.extend("sap.ui.model.mobx.MobxModel", /** @lends sap.ui.model.json.MobxModel.prototype */ {

      constructor : function(observable) {
        AbstractModel.apply(this, arguments);
        if (observable && typeof observable === "object") {
          this.setData(observable);
        }
      }
    });

    /**
     * Sets the JSON encoded data to the model.
     *
     * @param {object} oData the data to set on the model
     * @param {boolean} [bMerge=false] whether to merge the data instead of replacing it
     *
     * @public
     */
    MobxModel.prototype.setData = function(oData, bMerge){
      if (bMerge) {
        // do a deep copy
        throw new Error('merge not yet implemented');
      } else {
        this.oData = oData;
      }
    };

    MobxModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
      var oBinding = new MobxPropertyBinding(this, sPath, oContext, mParameters);
      return oBinding;
    };

    /**
     * @see sap.ui.model.Model.prototype.bindList
     *
     */
    MobxModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
      var oBinding = new MobxListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
      mobx.autorun(function(){oBinding.checkUpdate();});
      return oBinding;
    };

    /**
     * Sets a new value for the given property <code>sPropertyName</code> in the model.
     * If the model value changed all interested parties are informed.
     *
     * @param {string}  sPath path of the property to set
     * @param {any}     oValue value to set the property to
     * @param {object} [oContext=null] the context which will be used to set the property
     * @param {boolean} [bAsyncUpdate] whether to update other bindings dependent on this property asynchronously
     * @return {boolean} true if the value was set correctly and false if errors occurred like the entry was not found.
     * @public
     */
    MobxModel.prototype.setProperty = function(sPath, oValue, oContext, bAsyncUpdate) {
      var sResolvedPath = this.resolve(sPath, oContext),
        iLastSlash, sObjectPath, sProperty;

      // return if path / context is invalid
      if (!sResolvedPath) {
        return false;
      }

      // If data is set on root, call setData instead
      if (sResolvedPath == "/") {
        this.setData(oValue);
        return true;
      }

      iLastSlash = sResolvedPath.lastIndexOf("/");
      // In case there is only one slash at the beginning, sObjectPath must contain this slash
      sObjectPath = sResolvedPath.substring(0, iLastSlash || 1);
      sProperty = sResolvedPath.substr(iLastSlash + 1);

      var oObject = this._getObject(sObjectPath);
      if (oObject) {
        oObject[sProperty] = oValue;
        this.checkUpdate(false, bAsyncUpdate);
        return true;
      }
      return false;
    };

    /**
     * Returns the value for the property with the given <code>sPropertyName</code>
     *
     * @param {string} sPath the path to the property
     * @param {object} [oContext=null] the context which will be used to retrieve the property
     * @type any
     * @return the value of the property
     * @public
     */
    MobxModel.prototype.getProperty = function(sPath, oContext) {
      return this._getObject(sPath, oContext);
    };

    /**
     * @param {string} sPath
     * @param {object} [oContext]
     * @returns {any} the node of the specified path/context
     */
    MobxModel.prototype._getObject = function (sPath, oContext) {
      var oNode = this.isLegacySyntax() ? this.oData : null;
      if (oContext instanceof Context) {
        oNode = this._getObject(oContext.getPath());
      } else if (oContext) {
        oNode = oContext;
      }
      if (!sPath) {
        return oNode;
      }
      var aParts = sPath.split("/"),
        iIndex = 0;
      if (!aParts[0]) {
        // absolute path starting with slash
        oNode = this.oData;
        iIndex++;
      }
      while (oNode && aParts[iIndex]) {
        oNode = oNode[aParts[iIndex]];
        iIndex++;
      }
      return oNode;
    };

    return MobxModel;

  });
