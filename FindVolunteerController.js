({
    doInit : function(component, event, helper) {
        helper.onFieldSetChange(component, event, helper);
    },
    doSelectChange : function(component, event, helper) {
        helper.onSelectChange(component, event, helper);
    },
   
    handlePress : function(component, event, helper) {
        // alert(JSON.stringify(objectName));
        helper.onUpserObject(component, event, helper);
    },
    checkValue : function(component, event, helper) {
        var name = event.getSource().get("v.name")
        var check = event.getSource().get("v.checked")
        var cmp = 'v.sObjectName.'+name;
        var d = component.set(cmp,check);
    },
    updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    }
})