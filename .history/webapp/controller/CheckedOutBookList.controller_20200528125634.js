sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel",
  ],
  function (Controller, MessageToast, Fragment, ResourceModel) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.CheckedOutBookList", {
      onInit: function () {
        var i18nModel = new ResourceModel({
          bundleName: "org.ubb.books.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
      },
      
      handleCloseCheckedOutBooksDialog() {
        this.byId("idBookUpdateDialog").close();
      },
    });
  },
);
