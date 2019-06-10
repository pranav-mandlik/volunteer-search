({
    
    configMap: {
        "string": {
            componentDef: "lightning:input",
            attributes: {
                "class": "slds-input container",
            }
        },
        "checkbox": {
            componentDef: "lightning:input",
            attributes: {
                "class": "slds-checkbox__label",
                "checked":false 
            }
        },
        "button": {
            componentDef: "lightning:button",
            attributes: {
                "variant": "brand",
                "iconName": "utility:automate",
                "label": "Submit Form"
            }
        },
        "picklist": {
            componentDef: "ui:inputSelect",
            attributes: {
                "class": "slds-select slds-select_container container"
            }
        },
        "multipicklist": {
            componentDef: "lightning:dualListbox",
            attributes: {
                "sourceLabel": "Available Options",
                "selectedLabe": "Selected Options",
                "readonly": false,
                "class":"multiSelect",
                "removeButtonLabel":true
            }
        },
        "textarea": {
            componentDef: "lightning:textarea",
            attributes: {
                "class": "slds-input container"
            }
        },
    },
    onInit: function (component, event, helper) {
        
        var getSobject = component.get('c.getsObjects');
        getSobject.setCallback(this, function (response) {
            var state = response.getState();
            
            if (component.isValid() && (state === 'SUCCESS' || state === 'DRAFT')) {
               
                var sObjectList = response.getReturnValue();
                
                var listOptions = [];
                listOptions.push({
                    label: '--Select One--',
                    value: ''
                });
                for (var i = 0; i < sObjectList.length; i++) {
                    listOptions.push({
                        label: sObjectList[i].split('####')[1],
                        value: sObjectList[i].split('####')[0]
                    });
                }
                component.set('v.sObjectList', listOptions);
            } else if (state === 'INCOMPLETE') {
                
            } else if (state === 'ERROR') {
                
            } else {
                
            }
        });
        //getSobject.setStorable();
        $A.enqueueAction(getSobject);
    },
    onSelectChange: function (component, event, helper) {
        
        var selectedObject = component.find('selectObject').get('v.value');
        var getFieldSet = component.get('c.getFieldSet');
        
        component.set("v.theForm", []);
        
        getFieldSet.setParams({
            "sObjectName": selectedObject
        });
        getFieldSet.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && (state === 'SUCCESS' || state === 'DRAFT')) {
                var fieldsSetList = response.getReturnValue();
                
                var listOptions = [];
                listOptions.push({
                    label: '--Select One--',
                    value: ''
                });
                for (var i = 0; i < fieldsSetList.length; i++) {
                    listOptions.push({
                        label: fieldsSetList[i].split('####')[1],
                        value: fieldsSetList[i].split('####')[0]
                    });
                }
                component.set('v.fieldSetList', listOptions);
            } else if (state === 'INCOMPLETE') {
               
            } else if (state === 'ERROR') {
                
            } 
        });
        //getFieldSet.setStorable();
        $A.enqueueAction(getFieldSet);
    },
    onFieldSetChange: function (component, event, helper) {
        var self = this;
        
        var FiledSetMember = component.get('c.getFieldSetMember');
        FiledSetMember.setParams({
            "objectName": 'Contact',
            "fieldSetName": 'GW_Volunteers__VolunteersFindCriteriaFS'
        });
        FiledSetMember.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && (state === 'SUCCESS' || state === 'DRAFT')) {
               
                var fieldSetMember = JSON.parse(response.getReturnValue());
                self.createForm(component, event, helper, fieldSetMember);
            } else if (state === 'INCOMPLETE') {
               
            } else if (state === 'ERROR') {
                
            } else {
                
            }
        });
        //FiledSetMember.setStorable();
        $A.enqueueAction(FiledSetMember);
        
        //data column
        var FiledSetMember = component.get('c.getsObjectFieldFromFieldSet');
        console.log('method call')
        FiledSetMember.setParams({
            "objectName": 'Contact',
            "fieldSetName": 'GW_Volunteers__VolunteersFindFS'
        });
        FiledSetMember.setCallback(this, function (response) {
            var state = response.getState();
            
            if (component.isValid() && (state === 'SUCCESS' || state === 'DRAFT')) {
               
                var fieldSetMember = JSON.parse(response.getReturnValue());
                console.log('Field Set Columns '+ JSON.stringify(fieldSetMember));
                component.set("v.dataColumns",fieldSetMember)
              
            } else if (state === 'INCOMPLETE') {
                console.log('INCOMPLETE');
            } else if (state === 'ERROR') {
                console.log('ERROR');
            } 
        });
        //FiledSetMember.setStorable();
        $A.enqueueAction(FiledSetMember);
    },
    createForm: function (component, event, helper, fieldSetMember) {
        
        // lookup section
        console.log('Before field Set member');
        console.log(fieldSetMember);
        console.log('After field Set member');
            
        // Create a map with availale inputs and according to this use the global map.
        var lightningInputMap = new Map();
        lightningInputMap.set('string', 'string');
       // lightningInputMap.set('boolean', 'boolean');
        lightningInputMap.set('date', 'date');
        lightningInputMap.set('datetime', 'datetime');
        lightningInputMap.set('email', 'email');
        lightningInputMap.set('file', 'file');
        lightningInputMap.set('password', 'password');
        lightningInputMap.set('search', 'search');
        lightningInputMap.set('tel', 'tel');
        lightningInputMap.set('url', 'url');
        lightningInputMap.set('number', 'number');
        lightningInputMap.set('radio', 'radio');
        
        // list of components to create and put into the component body..
        var inputDesc = [];
        var config = null;
        
        /*
		 * parse the FieldSet members and then create the members dynamically 
		 * and put those components into the component.
		 */
        console.log('fieldSetMember.length :'+fieldSetMember.length);
        for (var i = 0; i < fieldSetMember.length; i++) {
            var objectName = component.getReference("v.sObjectName");
            
            if (lightningInputMap.has(fieldSetMember[i].fieldType.toLowerCase())) {
               
                config = JSON.parse(
                    JSON.stringify(this.configMap['string'])
                );
                if (config) {
                    
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.type = fieldSetMember[i].fieldType;
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                }
            } 
            else if (fieldSetMember[i].fieldType.toLowerCase() === 'boolean') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['checkbox'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.type = 'checkbox';
                	config.attributes.onchange = component.getReference("c.checkValue") //error
                    config.attributes.name =fieldSetMember[i].fieldAPIName;// component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                	
                	inputDesc.push([
                        config.componentDef,
                        config.attributes
                        
                    ]);       
                	
            }
            
            else {
                if (fieldSetMember[i].fieldType.toLowerCase() === 'integer') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['string'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.type = 'number';
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                } else if (fieldSetMember[i].fieldType.toLowerCase() === 'phone') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['string'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.type = 'tel';
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                    
                    
                } else if (fieldSetMember[i].fieldType.toLowerCase() === 'textarea') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['textarea'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.name = fieldSetMember[i].fieldLabel;
                    
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                } else if (fieldSetMember[i].fieldType.toLowerCase() === 'picklist') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['picklist'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    //config.attributes.name = fieldSetMember[i].fieldLabel;
                    var pickList = fieldSetMember[i].pickListValues;
                    var options = [];
                    options.push({
                                value: 'None',
                                label: 'None'
                            });
                    for (var k = 0; k < pickList.length; k++) {
                        if (pickList[k].active) {
                            options.push({
                                value: pickList[k].value,
                                label: pickList[k].label
                            });
                        }
                    }
                    
                    config.attributes.options = options;
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                    
                } else if (fieldSetMember[i].fieldType.toLowerCase() === 'multipicklist') {
                    config = JSON.parse(
                        JSON.stringify(this.configMap['multipicklist'])
                    );
                    config.attributes.label = fieldSetMember[i].fieldLabel;
                    config.attributes.name = fieldSetMember[i].fieldLabel;
                    var pickList = fieldSetMember[i].pickListValues;
                    var options = [];
                    for (var k = 0; k < pickList.length; k++) {
                        if (pickList[k].active) {
                            options.push({
                                value: pickList[k].value,
                                label: pickList[k].label
                            });
                        }
                    }
                    config.attributes.options = options;
                    config.attributes.required =
                        fieldSetMember[i].isRequired || fieldSetMember[i].isDBRequired;
                    config.attributes.value =
                        component.getReference('v.sObjectName.' + fieldSetMember[i].fieldAPIName);
                    
                    inputDesc.push([
                        config.componentDef,
                        config.attributes
                    ]);
                }
            }
        }
        
        var newConfig = JSON.parse(
            JSON.stringify(this.configMap['button'])
        );
        newConfig.attributes.onclick = component.getReference("c.handlePress");
        
        $A.createComponents(inputDesc,
                            function (components, status, errorMessage) {
                                if (status === "SUCCESS") {
                                    var form = [];
                                    for (var j = 0; j < components.length; j++) {
                                        
                                        form.push(components[j]);
                                    }
                                    component.set("v.theForm", form);
                                } else if (status === "INCOMPLETE") {
                                    console.log("No response from server or client is offline.");
                                } else if (status === "ERROR") {
                                    console.log("Error: " + errorMessage);
                                    console.log(errorMessage);
                                }
                            }
         );
        
        
        
    },
    onUpserObject: function (component, event, helper) {
        
        component.set('v.truthy',true)
        var data = component.get('v.dataColumns')
        var count = data.length;
        var res = new Array()
		var cnt = 0
       
        for(var i = 0 ; i < count; i++) {
            	if (data[i].hasOwnProperty('isDBRequired')) {
                     var label =     data[i].fieldLabel
                	 var fieldName = data[i].fieldAPIName
                }else{
                      var label =     data[i].label
                	  var fieldName = data[i].fieldName    
                }
            
            if(fieldName == 'Name' || fieldName =='url'){                    
                
                res[i] =  {label: 'Full Name',initialWidth : 150, fieldName: 'url', type: 'url', 
            				typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}}
            }
            else if(fieldName == 'LastName'){
                res[i] = { label: label, fieldName: fieldName, initialWidth : 150,sortable: true } 
            }
            else{
                res[i] = { label: label, fieldName: fieldName, initialWidth : 150 } 
                   
            }                
        }
        console.log(res);
        component.set('v.dataColumns',res)
        
        var fetchContact = component.get('c.fetchContactRecord');
        fetchContact.setParams({
            "objectData": JSON.stringify(component.get('v.sObjectName'))
        });
        
        fetchContact.setCallback(this, function (response) {
           
            var state = response.getState();
            
            if (component.isValid() && (state === 'SUCCESS' || state === 'DRAFT')) {
                var contactResult = response.getReturnValue();
               
                for (var i = 0; i < contactResult.length; i++) {
                    var row = contactResult[i];
                    console.log(row);
                    
                    for(var rowIndex in row){
                        console.log(row[rowIndex]);
                        if(!Number.isNaN(row[rowIndex])){
                            row[rowIndex] = row[rowIndex].toString();
                        }
                    }
                    
                    if (row.Account) {
                        row.AccountName = row.Account.Name;
                    }
                     row.url = '/'+row.Id;
                    if(row.npsp__Primary_Affiliation__r){
                        
                        row.npsp__Primary_Affiliation__c = row.npsp__Primary_Affiliation__r.Name
                    }
                }
                //console.log('contact list :'+JSON.stringify(contactResult));
                component.set("v.contactList", contactResult);
            }
        });
       
       $A.enqueueAction(fetchContact);
    },
    sortData: function (component, fieldName, sortDirection) {
     var data = component.get("v.contactList");
     var reverse = sortDirection !== 'asc';
     //sorts the rows based on the column header that's clicked
     data.sort(this.sortBy(fieldName, reverse))
     component.set("v.contactList", data);
     },
 	
    sortBy: function (field, reverse, primer) {
     var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
     //checks if the two rows should switch places
     reverse = !reverse ? 1 : -1;
     return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
 	} 
    
})