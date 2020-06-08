sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {

        onDelete(oEvent){
            // console.log(this.byId('idBooksTable').getSelectedContexts()[0].getPath())
            // console.log(this.byId('idBooksTable').getSelectedContexts()[0].getObject())
             
            const aselectedContexts = this.byId("idBooksTable").getSelectedContexts();
            var sPath = aselectedContexts[0].getPath();
            this.getView().getModel().remove(sPath,{
				success: function () { 
					MessageToast.show("Book deleted!");
				},
				error: function () {
					MessageToast.show("Book could not be deleted!");
				}
			});
        },

        onAdd(oEvent){
            var oBook = {
				ISBN: "",
				Title: "",
				Author: "",
				Pdate: "",
				Language: "",
				Tnrbooks: 0,
				Avnrbooks: 0,
				Createdon: "",
				Createdby: "",
				Changedon: "",
				Changedby: ""
            };
            
            oBook.ISBN = this.byId("isbnadd").getValue();
            oBook.Title = this.byId("title").getValue();
            oBook.Author = this.byId("author").getValue();
            oBook.Pdate = this.byId("pdate").getValue();
            oBook.Language = this.byId("language").getValue();
            oBook.Tnrbooks = this.byId("tnrbooks").getValue();
            oBook.Avnrbooks = this.byId("avnrbooks").getValue();

            console.log(oBook)

            this.getView().getModel().create("/BOOKS", oBook, { //todoe adjust obook with model from abap
                success: function () {
                    MessageToast.show("Book inserted!");
                },
                error: function () {
                    MessageToast.show("Book already exists!");
                }
            });
        }
    });
 });