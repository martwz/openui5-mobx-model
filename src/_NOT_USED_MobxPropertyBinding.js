/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a property binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/PropertyBinding'],
  function(jQuery, ChangeReason, PropertyBinding) {
    "use strict";

    /**
     *
     * @class
     * Property binding implementation for JSON format
     *
     * @param {sap.ui.model.json.JSONModel} oModel
     * @param {string} sPath
     * @param {sap.ui.model.Context} oContext
     * @param {object} [mParameters]
     * @alias sap.ui.model.json.JSONPropertyBinding
     * @extends sap.ui.model.ClientPropertyBinding
     */
    var MobxPropertyBinding = PropertyBinding.extend("sap.ui.model.mobx.MobxPropertyBinding",{
      constructor: function(mobxModel, sPath, oContext, mParameters){
        PropertyBinding.apply(this, arguments);

        // mobx.extendObservable(this, {
        //   model: mobxModel,
        //   path: path,
        //   context: context
        // });

        var that = this;

        mobx.autorun(function(){
          // attempt to read property here, which implicitly creates observable subscription
          that.oModel.getProperty(that.sPath, oContext);
          that._fireChange({reason: ChangeReason.Change});
        })
      }
    });

    MobxPropertyBinding.prototype.getValue = function(){
      return this.oModel.getProperty(this.sPath, this.oContext);
    };

    MobxPropertyBinding.prototype._getValue = function(){
      return '_getValue';
    };

    /**
     * @see sap.ui.model.PropertyBinding.prototype.setValue
     */
    MobxPropertyBinding.prototype.setValue = function(oValue){
      if (this.bSuspended) {
        return;
      }
      if (!jQuery.sap.equal(this.oValue, oValue)) {
        if (this.oModel.setProperty(this.sPath, oValue, this.oContext, true)) {
          this.getDataState().setValue(oValue);
          this.oModel.firePropertyChange({reason: ChangeReason.Binding, path: this.sPath, context: this.oContext, value: oValue});
        }
      }
    };

    return MobxPropertyBinding;

  });
