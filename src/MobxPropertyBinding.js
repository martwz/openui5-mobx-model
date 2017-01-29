sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/PropertyBinding', './constants'],
  function (jQuery, ChangeReason, PropertyBinding, constants) {
    'use strict';

    var MobxPropertyBinding = PropertyBinding.extend(constants.NAMESPACE + '.MobxPropertyBinding', {
      constructor: function (mobxModel, path, context, params) {
        PropertyBinding.apply(this, arguments);

        this._model = mobxModel;
        this._path = path;
        this._context = context;
        this._params = params;

        this._mobxDisposer = mobx.reaction(
          this._model.getProperty.bind(this._model, path, context),
          this._fireChange.bind(this, {reason: ChangeReason.Change})
        );
      },
      destroy: function () {
        this._mobxDisposer();
        PropertyBinding.prototype.destroy.apply(this, arguments);
      }
    });

    MobxPropertyBinding.prototype.getValue = function () {
      return this._model.getProperty(this._path, this._context);
    };

    MobxPropertyBinding.prototype.setValue = function (value) {
      if (this.bSuspended) {
        return;
      }

      this._model.setProperty(this._path, value, this._context/*, true*/)
    };

    return MobxPropertyBinding;

  });
