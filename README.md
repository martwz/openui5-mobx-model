[![Build Status](https://travis-ci.com/martinxxd/openui5-mobx-binding.svg?branch=master)](https://travis-ci.com/martinxxd/openui5-mobx-binding)

openui5-mobx-binding 
=

Unofficial [ui5](https://github.com/SAP/openui5) bindings for [mobx](https://github.com/mobxjs/mobx).

Practically it is an adapter which wraps an mobx observable so that it can be used as model in ui5. You then can set properties directly on the mobx observable and also can have auto-updating computed properties which are just arbitrary javascript functions. You don't have to use ui5 `model.setProperty` or ui5 formatters anymore.

In practice this serves as a way more powerful data binding in ui5.

For an introduction and examples please read: https://blogs.sap.com/2017/01/30/advanced-state-management-in-sapui5-via-mobx/

### Ownership

- This small library was originally written by @geekflyer
- As of 20th Sep 2018 repo ownership was transferred from [@geekflyer](https://github.com/geekflyer) to [@martinxxd](https://github.com/martinxxd) who becomes the new owner of the library
