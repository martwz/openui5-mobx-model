[![Build Status](https://travis-ci.org/geekflyer/openui5-mobx-model.svg?branch=master)](https://travis-ci.org/geekflyer/openui5-mobx-model) [![codecov](https://codecov.io/gh/geekflyer/openui5-mobx-model/branch/master/graph/badge.svg)](https://codecov.io/gh/geekflyer/openui5-mobx-model)


mobx-ui5
========

Unofficial [ui5](https://github.com/SAP/openui5) bindings for [mobx](https://github.com/mobxjs/mobx).

Practically it is an adapter which wraps an mobx observable so that it can be used as model in ui5. You then can set properties directly on the mobx observable and also can have auto-updating computed properties which are just arbitrary javascript functions. You don't have to use ui5 `model.setProperty` or ui5 formatters anymore.

In practice this serves as a way more powerful databinding in ui5.

For an introduction and examples please read: https://blogs.sap.com/2017/01/30/advanced-state-management-in-sapui5-via-mobx/

### Status

- add more documentation
