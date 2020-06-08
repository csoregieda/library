sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel",
  ],
  function (Controller, MessageToast, Fragment, ResourceModel) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
      onInit: function () {
        var i18nModel = new ResourceModel({
          bundleName: "org.ubb.books.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
      },

      onDelete() {
        const selectedRows = this.byId("idBooksTable").getSelectedContexts();
        if (selectedRows.length === 0) {
          MessageToast.show("No book was selected!");
        } else {
          const selectedRow = selectedRows[0];
          const isbnPath = selectedRow.getPath();
          this.getView()
            .getModel()
            .remove(isbnPath, {
              success: () => {
                var oBundle = this.getView()
                  .getModel("i18n")
                  .getResourceBundle();
                var sMsg = oBundle.getText("bookDeleted");
                MessageToast.show(sMsg);
              },
              error: () => {
                var oBundle = this.getView()
                  .getModel("i18n")
                  .getResourceBundle();
                var sMsg = oBundle.getText("bookNotDeleted");
                MessageToast.show(sMsg);
              },
            });
        }
      },

      onAdd() {
        var book = {
          ISBN: "",
          AUTHOR: "",
          TITLE: "",
          DATE_PUBLISHED: "",
          LANGUAGE: "",
          TOTAL_NUMBER: 0,
          AVAILBLE_BOOKS: 0,
          CREATED_ON: "",
          CREATED_BY: "",
          CHANGED_ON: "",
          CHANGED_BY: "",
        };

        var oView = this.getView();

        // create dialog lazily
        if (!this.byId("idBookAddDialog")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            name: "org.ubb.books.view.AddDialog",
            controller: this,
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            var oModel = new sap.ui.model.json.JSONModel();
            oDialog.setModel(oModel);
            oDialog.getModel().setData(book);
            oDialog.open();
          });
        } else {
          oDialog.getModel().setData(book);
          this.byId("idBookAddDialog").open();
        }
      },

      handleCancel() {
        this.byId("idBookAddDialog").close();
      },

      handleSave(oEvent) {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        var oModel = oEvent.getSource().getModel();
        var oDialogData = oModel.getData();
        var validForm = true;
        console.log(oDialogData);
        if (oDialogData.ISBN.length === 0) {
          validForm = false;
          var sMsg = oBundle.getText("isbnReq");
          MessageToast.show(sMsg);
        }
        if (oDialogData.AUTHOR.length === 0) {
          validForm = false;
          var sMsg = oBundle.getText("authReq");
          MessageToast.show(sMsg);
        }
        if (oDialogData.TITLE.length === 0) {
          validForm = false;
          var sMsg = oBundle.getText("titleReq");
          MessageToast.show(sMsg);
        }
        // if (oDialogData.LANGUAGE.length === 0) {
        //   validForm = false;
        //   var sMsg = oBundle.getText("langReq");
        //   MessageToast.show(sMsg);
        // }
        // if(oDialogData.LANGUAGE !== 'EN' || oDialogData.LANGUAGE !== 'DE' || oDialogData.LANGUAGE !== 'RU'
        // || oDialogData.LANGUAGE !== 'FR' || oDialogData.LANGUAGE !== 'PT' || oDialogData.LANGUAGE !== 'ES') {
        //     validForm = false;
        //     var sMsg = oBundle.getText("invalidLanguage");
        //     MessageToast.show(sMsg);
        // }
        oDialogData.AVAILBLE_BOOKS = oDialogData.AVAILBLE_BOOKS;
        oDialogData.TOTAL_NUMBER = oDialogData.TOTAL_NUMBER;
        if (oDialogData.AVAILBLE_BOOKS > oDialogData.TOTAL_NUMBER) {
          validForm = false;
          var sMsg = oBundle.getText("noGreater");
          MessageToast.show(sMsg);
        }
        oDialogData.DATE_PUBLISHED = "2015-12-31T00:00:00";
        oDialogData.CREATED_ON = "2015-12-31T12";
        oDialogData.CHANGED_ON = "2015-12-31T12";
        if (validForm) {
          this.getView()
            .getModel()
            .create("/BOOKS", oDialogData, {
              success: function () {
                var sMsg = oBundle.getText("bookInserted");
                MessageToast.show(sMsg);
              },
              error: function () {
                var sMsg = oBundle.getText("bookNotInserted");
                MessageToast.show(sMsg);
              },
            });
        }
        this.byId("idBookAddDialog").close();
      },

      onUpdate(oEvent) {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        const selectedRows = this.byId("idBooksTable").getSelectedContexts();
        if (selectedRows.length === 0) {
          var sMsg = oBundle.getText("noBook");
          MessageToast.show(sMsg);
        } else {
          var oView = this.getView();
          var oObject = oView
            .byId("idBooksTable")
            .getSelectedContexts()[0]
            .getObject();
          var book = {
            ISBN: oObject.ISBN,
            AUTHOR: oObject.AUTHOR,
            TITLE: oObject.TITLE,
            DATE_PUBLISHED: oObject.DATE_PUBLISHED,
            LANGUAGE: oObject.LANGUAGE,
            TOTAL_NUMBER: oObject.TOTAL_NUMBER,
            AVAILBLE_BOOKS: oObject.AVAILBLE_BOOKS,
            CREATED_ON: "",
            CREATED_BY: "",
            CHANGED_ON: "",
            CHANGED_BY: "",
          };

          console.log(book);

          if (!this.byId("idBookUpdateDialog")) {
            // load asynchronous XML fragment
            Fragment.load({
              id: oView.getId(),
              name: "org.ubb.books.view.UpdateDialog",
              controller: this,
            }).then(function (oDialog) {
              oView.addDependent(oDialog);
              var oModel = new sap.ui.model.json.JSONModel();
              oDialog.setModel(oModel);
              oDialog.getModel().setData(book);
              oDialog.open();
            });
          } else {
            var oModel = new sap.ui.model.json.JSONModel();
            oDialog.setModel(oModel);
            oDialog.getModel().setData(book);
            this.byId("idBookUpdateDialog").open();
          }
        }
      },

      handleCancelUpdate() {
        this.byId("idBookUpdateDialog").close();
      },

      handleUpdate(oEvent) {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        var oModel = oEvent.getSource().getModel();
        var oDialogData = oModel.getData();
        var validForm = true;
        console.log(oDialogData);

        if (oDialogData.ISBN.length === 0) {
          validForm = false;
          var sMsg = oBundle.getText("isbnReq");
          MessageToast.show(sMsg);
        }
        if (oDialogData.AUTHOR.length === 0) {
          validForm = false;
          var sMsg = oBundle.getText("authorReq");
          MessageToast.show(sMsg);
        }
        if (oDialogData.TITLE.length === 0) {
          validForm = false;
          MessageToast.show("Title is required!");
        }
        if (oDialogData.LANGUAGE === 0) {
          validForm = false;
          var sMsg = oBundle.getText("langReq");
          MessageToast.show(sMsg);
        }
        // if(oDialogData.Language !== 'EN' || oDialogData.Language !== 'DE' || oDialogData.Language !== 'RU'
        //     || oDialogData.Language !== 'FR' || oDialogData.Language !== 'PT' || oDialogData.Language !== 'ES') {
        //     validForm = false;
        //     var sMsg = oBundle.getText("invalidLanguage");
        //     MessageToast.show(sMsg);
        // }
        oDialogData.AVAILBLE_BOOKS = oDialogData.AVAILBLE_BOOKS;
        oDialogData.TOTAL_NUMBER = oDialogData.TOTAL_NUMBER;
        if (oDialogData.AVAILBLE_BOOKS > oDialogData.TOTAL_NUMBER) {
          validForm = false;
          var sMsg = oBundle.getText("noGreater");
          MessageToast.show(sMsg);
        }
        oDialogData.DATE_PUBLISHED = "2015-12-31T00:00:00";
        oDialogData.CREATED_ON = "2015-12-31T00";
        oDialogData.CHANGED_ON = "2015-12-31T00";
        if (validForm) {
          var oView = this.getView();
          var sPath = oView
            .byId("idBooksTable")
            .getSelectedContexts()[0]
            .getPath();
          this.getView()
            .getModel()
            .update(sPath, oDialogData, {
              success: function () {
                var sMsg = oBundle.getText("bookUpdated");
                MessageToast.show(sMsg);
              },
              error: function () {
                var sMsg = oBundle.getText("bookNotUpdated");
                MessageToast.show(sMsg);
              },
            });
        }
        this.byId("idBookUpdateDialog").close();
      },

      onSeeCheckedOut() {
        if (!this.byId("idCheckedOutBooksDialog")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            name: "org.ubb.books.view.CheckedOutBookListDialog",
            controller: this,
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            var oModel = new sap.ui.model.json.JSONModel();
            oDialog.setModel(oModel);
            oDialog.getModel().setData(book);
            oDialog.open();
          });
        } else {
          oDialog.getModel().setData(book);
          this.byId("idCheckedOutBooksDialog").open();
        }
      },
    });
  }
);
