declare namespace sap.ui.mobx {
  export class MobxModel {
    constructor(initialDataOrObservable: object);

    getObservable(): object;

    setObservable(observable: object): void;

    getData(): object;

    setData(observable: object): void;

    bindProperty(sPath, oContext, mParameters);

    bindList(sPath, oContext, aSorters, aFilters, mParameters);

    setProperty(path: string, value: any, context?: any);
    setProperty(path: string, context?: any);

  }
}

declare module 'sap/ui/mobx/MobxModel' {
  export default sap.ui.mobx.MobxModel;
}
