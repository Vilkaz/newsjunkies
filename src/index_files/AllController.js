function BaseController(){};

BaseController.NODE_TYPE = 'data-ctrl';

BaseController.CLASS_ACTIVE = 'active';

BaseController.prototype = {
    init: function(app, rootNode, nodeType){
        this.app = app;
        this.rootNode = rootNode;
        this.rootConfig = this.getConfig(this.rootNode, nodeType);
        this.addBaseEventListener();
        this.createObject();
    },
    createObject: function(){

    },
    addBaseEventListener: function(){
      this.app.addEventListener(Application.EVENT_VIEW_UPDATED,    this, "handleViewUpdatedEvent");
      this.app.addEventListener(Application.EVENT_VIEW_DIED,       this, "handleViewDiedEvent");
      this.app.addEventListener(Application.EVENT_WINDOW_LOADED,   this, "handleWindowLoadedEvent");
    },
    handleViewUpdatedEvent: function(view){

    },
    handleViewDiedEvent: function(view){

    },
    handleWindowLoadedEvent: function(eventObj){

    },

    isInDom: function(){
      return this.app.jq.contains(document.documentElement, this.rootNode);
    },

    isChildNode: function(childNode,parentNode){
        return this.app.jq(parentNode).has(this.app.jq(childNode)).length ? true : false;
    },

    makeActive: function(element){
        this.app.jq(element).addClass(BaseController.CLASS_ACTIVE);
    },

    isActive: function(element){
        return this.app.jq(element).hasClass(BaseController.CLASS_ACTIVE);
    },

    makeInactive: function(element){
        this.app.jq(element).removeClass(BaseController.CLASS_ACTIVE);
    },

    getActive: function(element){
        return this.app.jq("."+BaseController.CLASS_ACTIVE, element);
    },

    getConfig: function(node, nodeType){
        var ctrlId = this.getCtrlId() != '' ? '-' + this.getCtrlId() : '';
        var config = {'id':'','action':{}};
        var jsonString = this.app.jq(node).attr(BaseController.NODE_TYPE + ctrlId + '-' + nodeType);
        if(jsonString != '' && jsonString != '{}'){
            try{config = eval("(" +this.app.jq(node).attr(BaseController.NODE_TYPE + ctrlId + '-' + nodeType) + ")");}catch(e){}
        }
        return config;
    },

    getCtrlId: function(){
        return this.rootConfig && this.rootConfig.id ? this.rootConfig.id : '';
    },

    getCtrlRelatedNodes: function(nodeType,node){
        var ctrlId = this.getCtrlId() != '' ? '-' + this.getCtrlId() : '';
        var att = '';
        if(nodeType instanceof Array) for( var i in nodeType) att += att == '' ? nodeType[i] : '-' + nodeType[i];
        else att = nodeType;
        return this.app.jq('[' + BaseController.NODE_TYPE + ctrlId + '-' + att + ']',node);
    },

    getCtrlRelatedObjects: function(nodeType,node){
        var array = [];
        var that = this;
        var att = '';
        if(nodeType instanceof Array) for( var i in nodeType) att += att == '' ? nodeType[i] : '-' + nodeType[i];
        else att = nodeType;
        this.getCtrlRelatedNodes(att).each(function(){
            var obj = {};
            obj['config'] = that.getConfig(this,att);
            obj['node'] = that.app.jq(this);
            array.push(obj);
        });
        return array;
    },

    bindEventToObjects: function(objects,event,callback){
        for(var i in objects){
            (function(index,objects){
                objects[index].node.bind(event,function(){
                    return callback(objects[index],index);
                });
            })(i, objects);
        }
    },

    isRelatedTo: function(controller){
        if(controller.getCtrlId() != '' && this.rootConfig.related)
            for(var i in this.rootConfig.related)
                if(this.rootConfig.related[i] == controller.getCtrlId())
                    return true;
        return false;
    },

    getActiveAction: function(actionObj,view){
        var action = actionObj && actionObj['default'] ? actionObj['default'] : [];
        action = actionObj && actionObj[view] ? actionObj[view] : action;
        return action;
    },
    
    getPageName: function(){
        return this.app.jq("body").attr("class");
    },

    getContext: function(element){
        return this.app.jq(element).attr("id").match(/ardbox\-[0-9_]+\-(.+)/) && RegExp.$1 || '';
    },

    getDocumentID: function(element){
        return this.app.jq(element).attr("id").match(/ardbox\-([0-9_]+)\-/) && RegExp.$1 || '';
    }
};


/* COLLAPSIBLE CONTROLLER */
function CollapsibleController(){};

CollapsibleController.NODE_TYPE = 'collapsible';
CollapsibleController.NODE_TYPE_ENTRY = 'entry';
CollapsibleController.NODE_TYPE_ENTRY_TRIGGER = 'trigger';

/* TRIGGER FUER ALLE EINTRAEGE */
CollapsibleController.NODE_TYPE_TRIGGER = 'trigger';
/* ENDE TRIGGER FUER ALLE EINTRAEGE */

CollapsibleController.NODE_TYPE_ENTRY_BODY = 'body';

CollapsibleController.CLASS_COLLAPSED = 'collapsed';
CollapsibleController.CLASS_ARROW = 'collapseArrow';
CollapsibleController.CLASS_HAS_ARROW = 'hasArrow';


function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}


CollapsibleController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        this.disabled = false;
        this.allOpen = false;
        this.touchMoved = false;
        this.closeEntriesOnVanish = false;
        this.refreshOnAdded = false;
        if(this.rootConfig.refreshOnAdded) this.refreshOnAdded = true;

        this.entries = this.getCtrlRelatedObjects(CollapsibleController.NODE_TYPE_ENTRY,this.rootNode);
        
/* HW: Pfeil-Behandlung und Cookies */       
        this.arrows = true;
		this.saveStatus = false;
        if(typeof this.rootConfig.arrows !== "undefined"){
			if(this.rootConfig.arrows == "false"){
        		this.arrows = false;
        	}
        }
        if(typeof this.rootConfig.saveStatus !== "undefined"){
			if(this.rootConfig.saveStatus == "true"){
        		this.saveStatus = true;
        	}
        }      
/* Ende Pfeil-Behandlung und Cookies */       

        
/* TRIGGER FUER ALLE EINTRAEGE */
        this.triggers = this.getCtrlRelatedObjects(CollapsibleController.NODE_TYPE_TRIGGER,this.rootNode);
		var that = this;
        this.bindEventToObjects(this.triggers, 'click',function(obj,index){
            return that.handleTriggerActionAll(obj,index);
        });
/* ENDE TRIGGER FUER ALLE EINTRAEGE */
        
        
        
        for(var i in this.entries){
            this.entries[i]['disabled'] = false;
            this.entries[i]['body'] = this.getCtrlRelatedObjects([this.entries[i].config.id, CollapsibleController.NODE_TYPE_ENTRY_BODY],this.rootNode)[0];
            this.entries[i]['trigger'] = this.getCtrlRelatedObjects([this.entries[i].config.id, CollapsibleController.NODE_TYPE_ENTRY_TRIGGER],this.rootNode)[0];
            this.entries[i]['trigger'].justClicked = false;
            this.entries[i]['trigger'].justClickedTimer = null;
            this.entries[i]['collapsed'] = this.entries[i]['body']['node'].is(':visible');
            if(this.arrows){
            	this.appendArrowNode(this.entries[i]['trigger']);
            }
            (function(index,that){
                that.entries[index]['trigger']['node'].click(function(){
                    if(that.entries[index].disabled) return true;
                    if(that.entries[index]['trigger'].justClicked === false) that.handleTriggerAction(that.entries[index],index);
                    that.triggerClicked(that.entries[index]['trigger']);
                    return false;
                }).find('a').focus(function(){
                    if(that.entries[index].disabled) return true;
                    if(that.entries[index]['trigger'].justClicked === false) that.handleTriggerAction(that.entries[index],index);
                    that.triggerClicked(that.entries[index]['trigger']);
                });
                that.entries[index].body.node.find("a:last").blur(function(){
                  that.handleBlurAction(that.entries[index],index);
                });
            })(i,this);
        }
        if(this.arrows){
	        this.handleArrows();
	    }
        this.handleRootAction('init');            
        this.handleEntryAction('init');
    },

    handleEventListener: function(){
      if(this.disabled === true){
        this.app.removeEventListener(Application.EVENT_CONTENT_ADDED,   this, "handleContentAddedEvent");
        this.app.removeEventListener(Application.EVENT_MOUSE_CLICKED,   this, "handleMouseClickedEvent");
        this.app.removeEventListener(Application.EVENT_TOUCH_MOVE,      this, "handleTouchMoveEvent");
        this.app.removeEventListener(Application.EVENT_TOUCH_END,       this, "handleTouchEndEvent");
      }else{
        if(this.closeEntriesOnVanish === true){
          this.app.addEventListener(Application.EVENT_MOUSE_CLICKED,    this, "handleMouseClickedEvent");
          this.app.addEventListener(Application.EVENT_TOUCH_MOVE,       this, "handleTouchMoveEvent");
          this.app.addEventListener(Application.EVENT_TOUCH_END,        this, "handleTouchEndEvent");
        }else{
          this.app.removeEventListener(Application.EVENT_MOUSE_CLICKED, this, "handleMouseClickedEvent");
          this.app.removeEventListener(Application.EVENT_TOUCH_MOVE,    this, "handleTouchMoveEvent");
          this.app.removeEventListener(Application.EVENT_TOUCH_END,     this, "handleTouchEndEvent");
        }
        if(this.refreshOnAdded === true){
          this.app.addEventListener(Application.EVENT_CONTENT_ADDED,    this, "handleContentAddedEvent");
        }else{
          this.app.removeEventListener(Application.EVENT_CONTENT_ADDED, this, "handleContentAddedEvent");
        }
      }
    },

    handleContentAddedEvent: function(node){
        if(this.refreshOnAdded === true && this.isChildNode(node,this.rootNode)) {
            for(var e in this.entries)
              if(this.isChildNode(node,this.entries[e].body.node) || node == this.rootNode) return;
            this.createObject();
          this.handleViewUpdatedEvent(this.app.currentView);
        }
    },

    handleViewUpdatedEvent: function(view){
        this.handleRootAction(view);
        this.handleEntryAction(view);
    },

    handleMouseClickedEvent: function(eventObj){
        this.closeAllOnVanish(eventObj);
    },

    handleTouchMoveEvent: function(eventObj){
      if(this.disabled || this.touchMoved == true) return;
      this.touchMoved = true;
    },

    handleTouchEndEvent: function(eventObj){
      if(this.disabled) return;
      if(!this.touchMoved) this.closeAllOnVanish(eventObj);
      this.touchMoved = false;
    },

    handleBlurAction: function(entry, index){
        if(this.disabled) return;
        var that = this;
        window.setTimeout(function(){
            if(!that.isChildNode(that.app.currentFocus,entry.body.node))
                that.closeBody(entry);
        },150);
    },

    closeAllOnVanish: function(event){
        if(this.disabled || !this.closeEntriesOnVanish) return;
        var open = this.getOpenEntries();
        if( open.length == 0) return;
        if(!this.isChildNode(event.target,this.rootNode)) {
            this.closeEntries();
            event.preventDefault();
        }
    },

    getOpenEntries: function(){
        var entries = [];
        for(var i in this.entries)
            if(!this.entries[i].collapsed) entries.push(this.entries[i]);
        return entries;
    },

    triggerClicked:function(trigger){
        trigger.justClicked = true;
        var clearTimer = function(){
            if(trigger.justClickedTimer !== null){
                window.clearTimeout(trigger.justClickedTimer);
                trigger.justClickedTimer = null;
            }
        };
        clearTimer();
        trigger.justClickedTimer = window.setTimeout(function(){
            trigger.justClicked = false;
            clearTimer();
        },300);
    },

    handleRootAction: function(view){
        var action = this.getActiveAction(this.rootConfig.action,view);
        this.closeEntriesOnVanish = false;
        for(var i in action){
            switch(action[i]){
                case 'enable' :  this.enable(); break;
                case 'disable' :  this.disable(); break;
                /*HW*/
                case 'openFirstEntry':  this.openFirstEntry(); break;
                case 'loadCookieStatus':  this.loadCookieStatus(); break;
                /*ENDE HW*/
                case 'openEntries' :  this.openEntries(); break;
                case 'closeEntries':  this.closeEntries(); break;
                case 'closeEntriesOnVanish':  this.closeEntriesOnVanish = true; break;
            }
        }
        
        this.handleEventListener();
    },

    handleEntryAction: function(view){
      if(this.disabled) return;
      for(var e in this.entries){
        var action = this.getActiveAction(this.entries[e].config.action,view);
        this.enableEntry(this.entries[e]);
        for(var i in action){
          switch(action[i]){
            case 'disable' :  this.disableEntry(this.entries[e]); break;
            case 'openBody' :  this.openBody(this.entries[e]); break;
          }
        }
      }
    },

    handleTriggerAction: function(entry, index){
        if(this.disabled) return;
        var action = this.getActiveAction(entry.trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
            	case 'followLink' :  this.followLink(entry); break;
            	case 'toggleBody' :  this.toggleBody(entry); break;
                case 'closeOtherEntries' :  this.closeOtherEntries(index); break;
            }
        }
        this.app.dispatchEvent(Application.EVENT_CONTENT_ADDED,this.rootNode);
    },
    
    /* TRIGGER FUER ALLE EINTRAEGE */
    handleTriggerActionAll: function(trigger, index){
        var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'toggleAllEntries' :  this.toggleAllEntries(trigger); break;
            }
        }
        this.app.dispatchEvent(Application.EVENT_CONTENT_ADDED,this.rootNode);
    },
/* ENDE TRIGGER FUER ALLE EINTRAEGE */
    

    enable: function(){
        this.disabled = false;
        if(this.arrows){
	        this.handleArrows();
	    }
    },

    disable: function(){
        this.disabled = true;
        if(this.arrows){
	        this.handleArrows();
	    }
    },

    enableEntry: function(entry){
        if(this.arrows){
        	this.showArrowNode(entry.trigger);
	    }
      entry.disabled = false;
    },

    disableEntry: function(entry){
      this.hideArrowNode(entry.trigger);
      entry.disabled = true;
    },

    openEntries: function(show){
        var that = this;
    	
    	for(var i in this.entries){
            this.entries[i]['body']['node'].show();
            this.entries[i]['collapsed'] = false;
            this.updateClasses(this.entries[i]);
            
        	for(var x in that.app.controller){        
            	for(var y in that.app.controller[x]){        
                    if(that.isChildNode(that.app.controller[x][y].rootNode,that.entries[i].node) && typeof that.app.controller[x][y].handleViewUpdatedEvent == 'function' ){
                    	that.app.controller[x][y].handleViewUpdatedEvent(that.app.currentView);
                    }
            	}
        	}

            
            
            /* HW */
            if(this.saveStatus == true){
              	cookieID = this.entries[i].config.id;              	
				setCookie(cookieID,"expanded",4);
            }

            /* ENDE */
            
        }
        this.allOpen = true;
    },

    /*HW*/
    loadCookieStatus: function(){
        for(var i in this.entries){
           	var cookieID = this.entries[i].config.id;
           	myCookie=getCookie(cookieID);
	    	if(myCookie == "collapsed"){
					 this.entries[i]['body']['node'].hide();
            		 this.entries[i]['collapsed'] = true;
            		 this.updateClasses(this.entries[i]);					
				} else {
					 this.entries[i]['body']['node'].show();
            		 this.entries[i]['collapsed'] = false;
            		 this.updateClasses(this.entries[i]);
     				 setCookie(cookieID,"expanded",4);
				}
			}
            this.updateClasses(this.entries[i]);
    },
    
    openFirstEntry: function(){
            this.entries[0]['body']['node'].show();
            this.entries[0]['collapsed'] = false;
            this.updateClasses(this.entries[0]);
    },

    /*ENDE HW*/


/* TRIGGER FUER ALLE EINTRAEGE */
    toggleAllEntries: function(trigger){
        if(this.allOpen == false){
        	this.openEntries();
        	this.allOpen = true;
        	trigger['node'].html('Alles einklappen');        	
        } else {       
        	this.closeEntries();
            this.allOpen = false;
        	trigger['node'].html('Alles ausklappen');
        }
    },
/* ENDE TRIGGER FUER ALLE EINTRAEGE */
    
    closeEntries: function(){
        for(var i in this.entries){
            this.entries[i]['body']['node'].hide();
            this.entries[i]['collapsed'] = true;
            this.updateClasses(this.entries[i]);
            
            if(this.saveStatus = true){
              	cookieID = this.entries[i].config.id;
				setCookie(cookieID,"collapsed",4);
            }
        }
    },

    closeOtherEntries: function(index){
        for(var i in this.entries){
            if(i == index) continue;
            this.entries[i]['body']['node'].hide();
            this.entries[i]['collapsed'] = true;
            this.updateClasses(this.entries[i]);
        }
    },

    openBody: function(entry){
        if(entry['collapsed']==false) return;
        var that = this;
        var callback = function(){that.updateClasses(entry);};
        entry['collapsed'] = false;
        entry['body']['node'].slideDown(0,callback);
    },

    closeBody: function(entry){
        if(entry['collapsed']==true) return;
        var that = this;
        var callback = function(){that.updateClasses(entry);};
        entry['collapsed'] = true;
        entry['body']['node'].slideUp(0,callback);
    },

    toggleBody: function(entry){
        var that = this;
        var callback = function(){
        	that.updateClasses(entry);
        	for(var x in that.app.controller){        
            	for(var y in that.app.controller[x]){        
                    if(that.isChildNode(that.app.controller[x][y].rootNode,entry.node) && typeof that.app.controller[x][y].handleViewUpdatedEvent == 'function'){
                    	that.app.controller[x][y].handleViewUpdatedEvent(that.app.currentView);
                    }
            	}
        	}
        };
        if(entry['body']['node'].is(':visible')){
            entry['collapsed'] = true;
            entry['body']['node'].slideUp(0,callback);
            /*HW*/
            if(that.saveStatus == true){
             	cookieID = entry.config.id;
				setCookie(cookieID,"collapsed",4);
            }
            /*ENDE HW*/
        }else{
            entry['collapsed'] = false;
            entry['body']['node'].slideDown(0,callback);
            /*HW*/
            if(that.saveStatus == true){
              	cookieID = entry.config.id;
				setCookie(cookieID,"expanded",4);
            }
            /*ENDE HW*/
        }
    },
    
    
    followLink: function(entry){
        window.location.href = jQuery(entry['node']).find('a').attr('href');
    },
    
    

    appendArrowNode: function(trigger){
        trigger['arrowNode'] = this.app.jq('<div class="'+CollapsibleController.CLASS_ARROW+'"></div>');
        trigger['node'].append(trigger['arrowNode']).addClass(CollapsibleController.CLASS_HAS_ARROW);
    },

    hideArrowNode: function(trigger){
      trigger['arrowNode'].hide();
      trigger['node'].removeClass(CollapsibleController.CLASS_HAS_ARROW);
    },

    showArrowNode: function(trigger){
      trigger['arrowNode'].show();
      trigger['node'].addClass(CollapsibleController.CLASS_HAS_ARROW);
    },

    handleArrows: function(){
        for(var i in this.entries){
            if(this.disabled !== true) {
                this.entries[i]['trigger']['arrowNode'].css({'position':'absolute','right':0,'top':'0'}).show();
                this.entries[i]['trigger']['node'].css({'position':'relative','cursor':'pointer'});
            }
            else{
                this.entries[i]['trigger']['arrowNode'].attr('style','').hide();
                this.entries[i]['trigger']['node'].css({'position':'static','cursor':'default'})
            }
        }
    },

    updateClasses: function(entry){
        if(!entry['collapsed']){
            entry['trigger']['node'].removeClass(CollapsibleController.CLASS_COLLAPSED);
        }
        if( entry['collapsed']){
            entry['trigger']['node'].addClass(CollapsibleController.CLASS_COLLAPSED);
        }
    }
});

/* FORMULAR CONTROLLER */

function FormularController(){};

FormularController.NODE_TYPE = 'formular';
FormularController.NODE_TYPE_INPUT = 'input';
FormularController.NODE_TYPE_DATEPICKER = 'datepicker';
FormularController.NODE_TYPE_TRIGGER = 'trigger';

//FormularController.prototype = objectUtil.extendObject(new BaseController(), {
FormularController.prototype = jQuery.extend(new BaseController(), {
    createObject: function(){
        var that = this;
        this.inputs = this.getCtrlRelatedObjects(FormularController.NODE_TYPE_INPUT,this.rootNode);
        this.triggers = this.getCtrlRelatedObjects(FormularController.NODE_TYPE_TRIGGER,this.rootNode);
        this.datepicker = this.getCtrlRelatedObjects(FormularController.NODE_TYPE_DATEPICKER,this.rootNode);

        /* SetSelectedDate */
        this.setDate = '';
        if(typeof this.rootConfig.setDate !== "undefined") this.setDate = this.rootConfig.setDate;
        
        for(var i in this.inputs) this.initInput(this.inputs[i]);
        for(var i in this.datepicker) this.initDatepicker(this.datepicker[i],this);

        this.bindEventToObjects(this.triggers,'click', function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
        this.bindEventToObjects(this.inputs, 'focus', function(obj,index){
            return that.handleInputFocusAction(obj,index);
        });
        this.bindEventToObjects(this.inputs, 'blur', function(obj,index){
            return that.handleInputBlurAction(obj,index);
        });
    },
    handleViewUpdatedEvent: function(view){

    },
    handleViewDiedEvent: function(view){

    },
    handleTriggerAction: function(trigger, index){
    	var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'submit' 		:  this.rootNode.submit(); break;
            }
        }
        return false;
    },

    handleInputFocusAction: function(input, index){
        var action = this.getActiveAction(input.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'switchValue' 		:  this.switchInputValue(input,true); break;
            }
        }
        return false;
    },
    handleInputBlurAction: function(input, index){
        var action = this.getActiveAction(input.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'switchValue' :  this.switchInputValue(input,false); break;
            }
        }
        return false;
    },

    switchInputValue: function(input, onFocus){
        if(onFocus){
            if(input.node.val() === input['defaultValue']){
                input.node.val("");
                this.makeActive(input.node);
            }
        }else{
            if(objectUtil.stringTrim(input.node.val()) === ""){
                input.node.val(input['defaultValue']);
                this.makeInactive(input.node);
            }
        }
    },

    initInput: function(input){
        input['defaultValue'] = input.node.val();
    },
    
    initDatepicker: function(picker,form){
    	myPicker = picker.node.datepicker({
			showOn: "button",
			buttonImage: "img/external/jquery-ui/datepicker/calendar.gif",
			buttonImageOnly: true,
			altField: "#datepickerValue",
			dateFormat: "dd.mm.yy",				 
			monthNames: ['Januar','Februar','Maerz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
			dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag','Samstag'],
			dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			firstDay: 1,
			onSelect: function (dateText, inst) {
				form.rootNode.submit();
			},
	        defaultDate: this.setDate,
	        maxDate: picker.config.maxDate,
	        minDate: picker.config.minDate
		});
    }
});

/* IFRAME CONTROLLER */
function IFrameController(){};

IFrameController.NODE_TYPE = 'iframe';

IFrameController.prototype = objectUtil.extendObject(new BaseController(), {
    handleViewUpdatedEvent: function(view){
        this.updateAttributes(view);
    },
    updateAttributes: function(view){    	
    	var that = this,
    		action  = that.getActiveAction(that.rootConfig.action, view);
    	
		for(var attribute in action) {
			if ((attribute=='src' && that.app.jq(that.rootNode).attr('src')==action[attribute]) || attribute=='ratio')
				continue;
			that.app.jq(that.rootNode).attr(attribute,action[attribute]);
		}			
		if (action.ratio) {
			that.app.jq(that.rootNode).attr('height', Math.floor(that.app.jq(that.rootNode).width() / parseFloat(action.ratio)) + "px");
		}
    }
});

/* LAYOUT CONTROLLER */

function LayoutController(){};

LayoutController.NODE_TYPE = 'layoutable';

LayoutController.NODE_TYPE_ENTRY = 'entry';

LayoutController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        this.entries = this.getCtrlRelatedObjects(LayoutController.NODE_TYPE_ENTRY,this.rootNode);
        this.timer = null;
        this.initalLoad = true;
        this.timeToWait = 0;
        this.offsetY = 0;
        this.refreshOnAdded = false;
        if(this.rootConfig.offsetY) this.offsetY = parseInt(this.rootConfig.offsetY);
        if(this.rootConfig.refreshOnAdded) this.refreshOnAdded = true;
        if(this.rootConfig.timeToWait) this.timeToWait = parseInt(this.rootConfig.timeToWait);
        this.handleEventListener();
    },

    handleEventListener: function(){
      if(this.refreshOnAdded === false){
        this.app.removeEventListener(Application.EVENT_CONTENT_ADDED, this, "handleContentAddedEvent");
      }else{
        this.app.addEventListener(Application.EVENT_CONTENT_ADDED,    this, "handleContentAddedEvent");
      }
    },

    handleViewUpdatedEvent: function(view){
        var that = this;
        this.clearTimer();
        this.timer = window.setTimeout(function(){
            if(!that.initalLoad){
                that.handleRootAction(view);
            }
            that.timer = null;
        },this.timeToWait);
    },

    handleViewDiedEvent: function(view){
        this.clearTimer();
        if(!this.initalLoad){
            this.clearLayout();
        }
    },

    handleContentAddedEvent: function(node){
        if(this.refreshOnAdded){
          var isChild = false;
          var that = this;

          if(this.app.jq(node)[0] === this.app.jq(this.rootNode)[0]) { this.setEntries(); isChild = true;}
          else for(var e in this.entries){if(this.isChildNode(node,this.entries[e].node)) {isChild = true; break;}}
          if(isChild === true){ this.clearLayout(this.app.currentView);}
          else {      	  
        		this.clearLayout(this.app.currentView);
          };
          window.setTimeout(function(){
	          that.handleRootAction(that.app.currentView);  	          
	      },this.timeToWait);
        }
      },

    handleWindowLoadedEvent: function(eventObj){
        var that = this;
        window.setTimeout(function(){
            that.handleRootAction(that.app.currentView);
            that.initalLoad = false;
        },that.timeToWait);
    },

    handleRootAction: function(view){
    	var action = this.getActiveAction(this.rootConfig.action,view);
        for(var i in action){
            switch(action[i]){
                case 'equalHeight' :  this.equalHeight(); break;
                case 'widthBound' :  this.widthBound(); break;
            }
        }
    },

    clearLayout: function(view){
        for(var i in this.entries){
            this.entries[i]['node'].height('auto');
            this.entries[i]['node'].css('marginLeft','');
        }
    },

    clearTimer: function(){
        if(this.timer != null) window.clearTimeout(this.timer);
        this.timer = null;
    },

    equalHeight: function(){
        var that = this;
        var done = {};        
        var goOn = true;
        while(goOn){
            goOn = false;
            var rows = {};
            for(var i in this.entries){
                var obj = this.entries[i]['node'];
                var pos = obj.offset();                
                if(!rows[pos.top]) rows[pos.top] = [];
                rows[pos.top].push(obj);
            }
            for(var row in rows){
                if(done[row] === true) continue;
                var maxHeight = 0;
                for(var set in rows[row]) if(rows[row][set].height() > maxHeight) maxHeight = rows[row][set].height();
                for(var set in rows[row]) rows[row][set].height(maxHeight+this.offsetY);
                done[row] = true;
                goOn = true;
                break;
            }
        } 
    },

    widthBound: function(){
        var rootObj = this.app.jq(this.rootNode);
        var rootWidth = rootObj.width();
        var rootPos = rootObj.offset();
        for(var i in this.entries){
            var isVisible = this.entries[i].node.is("visible");
            if(!isVisible) this.entries[i].node.show();
            var width = this.entries[i].node.outerWidth();
            var pos = this.entries[i].node.offset();
            var diff = 0;
            if(pos.left < rootPos.left) diff = rootPos.left - pos.left;
            else if((pos.left + width) > (rootPos.left + rootWidth)) diff = (pos.left + width) - (rootPos.left + rootWidth);
            if(diff != 0){
                var x = parseInt(this.entries[i].node.css('marginLeft'));
                this.entries[i].node.css('marginLeft',(x-diff)+'px');
            }
            if(!isVisible)this.entries[i].node.hide();
        }
    }
});

/* LOADER CONTROLLER */

function LoaderController(){};

LoaderController.NODE_TYPE = 'loader';

LoaderController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        this.initalLoad = true;
        this.timer = null;
        this.timeToWait = 500;
    },

    handleViewUpdatedEvent: function(view){
        var that = this;
        this.clearTimer();
        this.timer = window.setTimeout(function(){
            if(!that.initalLoad){
                that.app.jq(that.rootNode).hide();
            }
            that.timer = null;
        },that.timeToWait);
    },

    handleViewDiedEvent: function(view){
        if(!this.initalLoad){
            this.app.jq(this.rootNode).show();
        }
    },

    handleWindowLoadedEvent: function(eventObj){
        var that = this;
        window.setTimeout(function(){
            that.app.jq(that.rootNode).hide();
            that.initalLoad = false;
            window.scrollTo(0, 1);
        },that.timeToWait);
    },

    clearTimer: function(){
        if(this.timer != null) window.clearTimeout(this.timer);
        this.timer = null;
    }
});



/* PLAYER CONTROLLER */


function PlayerController(){};

PlayerController.NODE_TYPE = 'player';

PlayerController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        this.player = PlayerModel.getInstanceByPlayerID(this.rootNode.id);
        this.handleWindowLoadedEvent();
    },

    handleWindowLoadedEvent: function(){
        this.app.jq(this.rootNode).width('100%');
        this.app.jq(this.rootNode).height(this.app.jq(this.rootNode).parent().width()*0.5625);
        this.handleViewUpdatedEvent(this.app.currentView);
    },

    handleViewUpdatedEvent: function(view){
        var that = this;

        if(view == 'm' || view == 's') {this.app.jq(this.rootNode).addClass('s'); this.app.jq(this.rootNode).removeClass('m');}
        else {this.app.jq(this.rootNode).addClass('m'); this.app.jq(this.rootNode).removeClass('s');}

        window.setTimeout(function(){
            that.app.jq(that.rootNode).height(that.app.jq(that.rootNode).parent().width()*0.5625);
        },250);
    }
});

/* ATTRIBUTE SWAP CONTROLLER */
function AttributeSwapController(){};

AttributeSwapController.NODE_TYPE = 'attributeswap';

AttributeSwapController.prototype = objectUtil.extendObject(new BaseController(), {
    handleViewUpdatedEvent: function(view){
        this.updateAttributes(view);
    },
    updateAttributes: function(view){
      var that = this;
      // random timeout wegen iOS5 bilder-bug:
      // http://tech.vg.no/2011/12/14/safari-on-ios-5-randomly-switches-images/
      window.setTimeout(function(){
        var action  = that.getActiveAction(that.rootConfig.action, view);
        for(var attribute in action) that.app.jq(that.rootNode).attr(attribute,action[attribute]);
      },parseInt(Math.random()*50));
    }
});

/* QUIZABLE CONTROLLER */
function QuizableController(){};
QuizableController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        this.questionsCorrect = 0;
        this.currentEntry = 1;
        var that = this;
        this.entries = [];
        this.startButton = this.app.jq('.quizStart',this.rootNode);
        this.progress = this.app.jq('.quizProgress',this.rootNode);
        this.progressbar = this.app.jq('.quizProgressbar',this.rootNode);
        this.after = this.app.jq('.quizAfter',this.rootNode).hide();
        this.pre = this.app.jq('.quizPre',this.rootNode).show();
        this.questionsCount = this.app.jq(".quizEntry", this.rootNode).size();
        this.results = this.app.jq(".quizResults", this.rootNode);
        this.resultText = this.app.jq(".quizResultText", this.rootNode);
        this.resultQuote = this.app.jq(".quizQuote", this.rootNode);
        this.resultBar = this.app.jq(".quizResultBar", this.rootNode);
        var entryCnt = 1;
        this.app.jq(".quizEntry", this.rootNode).each(function(){
            var entry = {};
            entry['node'] = that.app.jq(this).hide();
            entry['result'] = entry['node'].find(".quizResult");
            entry['question'] = entry['node'].find(".quizQuestion");
            entry['nextButton'] = entry['node'].find(".quizNext").hide();
            entry['answers'] = [];
            that.app.jq('[class*=quizAnswer]',this).each(function(){
                var answer = {};
                answer['clicked'] = false;
                answer['node'] = that.app.jq(this);
                answer['name'] = that.app.jq(this).attr('class').match(/\s*quizAnswer([a-z-A-Z1-9]*)\s*/) && RegExp.$1;
                answer['isTrue'] = answer['node'].hasClass('quizRight');
                entry['answers'].push(answer);
            });
            entry['progressEntry'] = that.app.jq('<div class="progressEntry"></div>').width((100.00/that.questionsCount).toFixed(2)+'%');
            entry['lastResult'] = that.app.jq(".quizResult"+entryCnt,that.rootNode);
            that.progress.append(entry['progressEntry']);
            that.entries.push(entry);
            entryCnt++;
        });
        this.bindStartAction();
        this.bindAnswerAction();
    },

    handleViewUpdatedEvent: function(view){

    },

    handleViewDiedEvent: function(view){

    },

    startUp: function(){
        this.removeRightWrong();
        for(var i in this.entries){
            this.entries[i]['question'].show();
            this.entries[i]['result'].hide();
            if(i == 0) this.makeActive(this.entries[i]['progressEntry']);
        }
        this.questionsCorrect = 0;
        this.resultBar.html("");
        this.entries[0]['node'].show();
        this.progressbar.show();
        this.results.hide();
        this.after.hide();
        this.pre.hide();
    },

    nextEntry: function(entry){
        var next = (parseInt(entry)+1)+'';
        this.entries[entry]['node'].hide();
        this.entries[entry]['nextButton'].hide();
        this.makeInactive(this.entries[entry]['progressEntry']);
        for(var j in this.entries[entry]['answers']){this.entries[entry]['answers'][j]["clicked"] = false;}
        if(this.entries[next]){
            this.makeActive(this.entries[next]['progressEntry']);
            this.entries[next]['node'].show();
        }else{
            this.showResults();

        }
    },

    showResults: function(){
        var percent = ((this.questionsCorrect/this.questionsCount)*100.00).toFixed(2);
        this.resultText.html("Sie haben "+this.questionsCorrect+" richtige Antworten von "+this.questionsCount+" Fragen.");
        this.resultQuote.html("Quote: "+percent+"%");
        this.resultBar.append('<div class="resultLevel" style="width: '+percent+'%;"></div>');
        this.results.show();
        this.after.show();
        this.progressbar.hide();
    },

    answerSelected: function(entry, answer){
        var entryObj = this.entries[entry];
        var rightAnswer = null;
        if(entryObj['answers'][answer]['clicked'] == true) return;
        for(var j in entryObj['answers']){
            if(!entryObj['answers'][j]["isTrue"]) entryObj['answers'][j]['node'].addClass("wrong");
            if(entryObj['answers'][j]["isTrue"])  rightAnswer = entryObj['answers'][j];
            entryObj['answers'][j]["clicked"] = true;
        }
        rightAnswer['node'].addClass("right");
        if(entryObj['answers'][answer]["isTrue"]){
            entryObj['progressEntry'].addClass("right");
            entryObj["lastResult"].html('<strong class="right">-RICHTIG-</strong>');
            entryObj["result"].html('<strong class="rigth">- RICHTIG -</strong><br/>Die L√∂sung ist Antwort '+entryObj['answers'][answer]['name']);
            this.questionsCorrect++;
        }else{
            entryObj['progressEntry'].addClass("wrong");
            entryObj["lastResult"].html('<strong class="wrong">-FALSCH-</strong>');
            entryObj["result"].html('<strong class="wrong">- LEIDER FALSCH -</strong><br/>Antwort '+rightAnswer['name']+' ist leider falsch, richtig ist Antwort '+rightAnswer['name']+'.');
        }
        entryObj["result"].show();
        entryObj["question"].hide();
        entryObj['nextButton'].show();
    },

    removeRightWrong: function(){
        this.app.jq(".right", this.rootNode).removeClass("right");
        this.app.jq(".wrong", this.rootNode).removeClass("wrong");
    },

    bindStartAction: function(){
        var that = this;
        this.startButton.click(function(){that.startUp(); return false;});
    },

    bindAnswerAction: function(){
        var that = this;
        for(var i in this.entries){
            (function(entry, that){
                for(var j in that.entries[entry]['answers']){
                    (function(entry, answer, that){
                        that.entries[entry]['answers'][answer]['node'].click(function(){that.answerSelected(entry, answer);return false;});
                    })(entry, j, that);
                }
                that.entries[entry]['nextButton'].click(function(){that.nextEntry(entry); return false;});
            })(i, that);
        }
    }
});

/* SOPHORA LOADABLE CONTROLLER */

SophoraLoadableController = function(){};

SophoraLoadableController.NODE_TYPE = 'loadable';
SophoraLoadableController.NODE_TYPE_TRIGGER = 'trigger';
SophoraLoadableController.NODE_TYPE_SOURCE = 'source';
SophoraLoadableController.NODE_TYPE_TARGET = 'target';
SophoraLoadableController.NODE_TYPE_FILTER = 'filter';
SophoraLoadableController.NODE_TYPE_INFO = 'info';
SophoraLoadableController.NODE_TYPE_FORM = 'form';

SophoraLoadableController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        var that = this;
        
        this.keyControllable = false;
        if(this.rootConfig.keycontrollable == 'true') { this.keyControllable = true; }
        this.clickControllable = false;
        if(this.rootConfig.clickcontrollable == 'true') { this.clickControllable = true; }       
        this.loaded = {};
        this.disabled = false;
        this.filter = {};
        if(this.rootConfig.filter) this.setFilter(this.rootConfig.filter);

        this.infos = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_INFO,this.rootNode);
        this.sources = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_SOURCE,this.rootNode);
        this.target = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_TARGET,this.rootNode)[0];
        this.triggers = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_TRIGGER,this.rootNode);
        this.filters = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_FILTER,this.rootNode);
        this.forms = this.getCtrlRelatedObjects(SophoraLoadableController.NODE_TYPE_FORM,this.rootNode);

        this.postData = this.getPostDataFromForms();

        this.relatedSliders = this.app.findRelatedController(this,SlidableController.NODE_TYPE);
        this.relatedSliders = this.relatedSliders.length > 0 ? this.relatedSliders : false;
        
        this.relatedIVW = null;
                
        this.currentSource = 0;
        if (this.rootConfig.activeIndex) {
        	this.currentSource = parseInt(this.rootConfig.activeIndex);
        }

        if(this.relatedSliders){
        this.active = this.sources[this.currentSource];
        this.makeActive(this.active['node']);
        }
        
        this.bindEventToObjects(this.triggers, 'click',function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
        this.bindEventToObjects(this.filters, 'click',function(obj,index){
            return that.handleFilterAction(obj,index);
        });
        this.bindEventToObjects(this.sources, 'click', function(obj,index){
            return that.handleSourceAction(obj,index);
        });       

       this.bindEventToObject(this.target, 'click', function(obj) {
          if(that.clickControllable){
        	  return that.handleTargetClickedAction(obj);
          }
        });

        this.app.addEventListener(Application.EVENT_KEY_DOWN, this, "handleKeyDownEvent");

        this.handleRootAction('init');
        this.updateInfo();
    },
    
    bindEventToObject: function(object,event,callback){
        (function(object){
            object.node.bind(event,function(){
                return callback(object);
            });
        })(object);
    },

    handleViewUpdatedEvent: function(view){
        this.handleRootAction(view);
    },

    disable:function(){
        this.disabled = true;
        if(this.relatedSliders){
        	this.makeInactive(this.active.node);
        }
    },

    enable:function(){
        this.disabled = false;
        if(this.relatedSliders){
        	this.makeActive(this.active.node);
        }
    },

    handleRootAction: function(view){
        var action = this.getActiveAction(this.rootConfig.action,view);
        this.enable();
        for(var i in action){
            switch(action[i]){
                case 'disable' :  this.disable(); break;
            }
        }
    },
    
    handleKeyDownEvent: function(e){
    	if(this.disabled) return false;
    	
    	if( this.keyControllable && this.target.node.find('img:hover').length != 0) {
    	
    		var keyCode = e.which;
    		if(keyCode == undefined){
    			keyCode = e.keyCode;
    		}
	        if(keyCode === 37) {
	        	this.loadNext(-1);
	        	this.slideTo(this.currentSource);
	        	this.sendPrevToIVW();
	        	this.updateInfo();
	        }
	        else if(keyCode === 39) {
	        	this.loadNext(1);
	        	this.slideTo(this.currentSource);
	        	this.sendNextToIVW();
	        	this.updateInfo();
	        }
    	}
    	return false;
    },
    

    handleTargetClickedAction: function(object) {
    	if(this.disabled) return false;
    	if(object.node.find('img:hover').length != 0 && this.clickControllable) {
    		this.loadNext(1);
    		this.slideTo(this.currentSource);
    		this.sendNextToIVW();
    		this.updateInfo();
    	}    	
    	return false;
    },

    handleSourceAction: function(source, index){
        if(this.disabled) return true;
        if(this.hasSlider() && (this.relatedSliders[0].isSliding || this.relatedSliders[0].isTouching)) return false;
        var action = this.getActiveAction(source.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'load'   :    this.load(index); break;
                case 'slideTo':    this.slideTo(this.currentSource); break;
                case 'addFilter':  if(source.config.filter) this.addFilter(source.config.filter); break;
            }
        }
        this.updateInfo();
        return false;
    },

    handleTriggerAction: function(trigger, index){
        if(this.disabled) return false;
        if(this.hasSlider() && this.relatedSliders[0].isSliding) return false;
        var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'loadNext' :  this.loadNext(1); break;
                case 'loadPrev' :  this.loadNext(-1); break;
                case 'slideTo'  :  this.slideTo(this.currentSource); break;
                case 'updatePostData' :  this.postData = this.getPostDataFromForms(); break;
            }
        }
        this.updateInfo();
        return false;
    },

    handleFilterAction: function(filter, index){
        if(this.disabled) return false;
        if(this.hasSlider() && this.relatedSliders[0].isSliding) return false;
        var action = this.getActiveAction(filter.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'setFilter':       this.resetFilters(); if(filter.config.filter) this.setFilter(filter.config.filter); this.makeActive(filter.node); break;
                case 'addFilter':       if(filter.config.filter) this.addFilter(filter.config.filter); this.makeActive(filter.node); break;
                case 'resetFilters':    this.resetFilters(); break;
                case 'loadFirstSource': this.handleSourceAction(this.sources[0],0); break;
            }
        }
        this.updateInfo();
        return false;
    },

    loadForm: function(){

    },

    load: function(sourceIndex){
        var that = this;
        if(this.relatedSliders){
        this.makeInactive(this.active.node);
        }
        this.active = this.sources[sourceIndex];

        this.currentSource = parseInt(sourceIndex);

        if(this.relatedSliders){

        this.makeActive(this.active.node);
        }

        var parentNode = this.target.node[0];
        var url = this.getRequestUrl();
        if(this.loaded[url]){
        	this.target.node.html(this.loaded[url]);
            this.app.dispatchEvent(Application.EVENT_CONTENT_LOADED,parentNode);
            this.app.dispatchEvent(Application.EVENT_CONTENT_ADDED,parentNode);
        }else{
            this.app.jq.get(url,this.getData,function(data){
            	that.loaded[url] = that.app.jq(data);
                that.target.node.html(that.loaded[url]);
                that.app.dispatchEvent(Application.EVENT_CONTENT_LOADED,parentNode);
                that.app.dispatchEvent(Application.EVENT_CONTENT_ADDED,parentNode);
            });
        }
    },

    loadNext: function(direction){
        var next = this.currentSource;
        if(direction > 0){
            if((next + 1) < this.sources.length) next += 1;
            else next = 0;
        }else{
            if((next - 1) >= 0) next -= 1;
            else next = this.sources.length - 1;
        }
        this.load(next);
    },

    hasSlider: function(){
        return this.relatedSliders && this.relatedSliders !== false;
    },

    slideTo: function(sourceIndex){
        if(this.relatedSliders != false) this.relatedSliders[0].slideToChild(this.sources[sourceIndex].node, true);
    },

    setFilter: function(filterObj){
        if(filterObj) this.filter = filterObj;
    },
    
    setRelatedIVW: function(ivw) {
    	this.relatedIVW = ivw;
    },
    
    sendNextToIVW: function() {
    	if(this.relatedIVW) this.relatedIVW.sendNextClickTrack(this.relatedIVW.triggers[0].config.parameter);
    },
    
    sendPrevToIVW: function() {
    	if(this.relatedIVW) this.relatedIVW.sendPrevClickTrack(this.relatedIVW.triggers[0].config.parameter);
    },

    addFilter: function(filterObj){
        if(filterObj) for(var i in filterObj) this.filter[i] = filterObj[i];
    },

    resetFilters: function(){
        for(var i in this.filters) this.makeInactive(this.filters[i].node);
        this.filter = {};
    },

    getPostDataFromForms: function(){
        var data = "";
        for(var i in this.forms){
            if(data !== "") data += "&";
            data += this.forms[i].node.serialize();
        }
        return data;
    },

    getRequestUrl: function(){
        var filter = '';
        if(this.filter.sortBy) filter += '_'+this.filter.sortBy;
        if(this.filter.page)   filter += '_'+this.filter.page;

//        if(this.target.config.context.match(/List/)||this.target.config.context.match(/Glossar/)||this.target.config.context.match(/Tagcloud/)||this.target.config.context.match(/Table/)||this.target.config.context.match(/Social/)||this.target.config.context.match(/Comments/))
//            return './data/include/'+this.active.config.content+filter+'.html';

        return this.active.config.url;
    },

    updateInfo: function(){
        for(var i in this.infos){
            switch(this.infos[i].config.content){
                case 'sourceCounter' : this.infos[i].node.html((this.currentSource+1)+'/'+this.sources.length); break;
                case 'sourceFilter' : this.infos[i].node.html(this.sources[this.currentSource].config.filter); break;
            }
        }
    }
});


/* TABLE CONTROLLER */

function TableController(){};

TableController.NODE_TYPE = 'table';

TableController.CLASS_EVEN = 'even';

TableController.HELPER_TRIGGER_NAME = "data-ctrl-sort-trigger";

TableController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject:function(){
      var that = this;
      this.initalLoad = true;
      this.columns = [];
      this.hideCols = {};
      this.fixCols = {};
      
      this.fixed = false;
      this.fixTable = null;
	  this.scrollTable = null;
	  this.scrollTableContainer = null;
	  
	  this.sortTriggers = [];
      this.sortProxyTriggers = [];
      
      this.app.jq("tr",this.rootNode).each(function(){
        var row = that.app.jq(this);
        var colCnt = 0;
        row.find('td,th').each(function(){
          if(that.columns[colCnt] == undefined) that.columns[colCnt] = {'cols':[],'visible':true};
          that.columns[colCnt].cols.push(that.app.jq(this));
          colCnt++;
        });
        row.find('th').each(function(){
        	that.sortTriggers.push(that.app.jq(this));
        });
      });
      
      if(this.rootConfig.hideCols) this.hideCols = this.rootConfig.hideCols;
      if(this.rootConfig.fixCols) this.fixCols = this.rootConfig.fixCols;	        	
      
      
      this.handleRootAction(this.app.currentView);
    },

	handleWindowLoadedEvent: function(eventObj){
		var that = this;
		//execute adjustWidth() AFTER all the Markup Manipulation is finished
        window.setTimeout(function(){
            that.adjustWidth();
        }, 0);
    },

    handleViewUpdatedEvent: function(view){
      this.handleRootAction(view);      
    },

	adjustWidth: function(){
		if(this.fixTable != null && this.scrollTable != null){
			var fixedWidth = this.fixTable.width();
			var containerWidth = this.app.jq(this.rootNode).closest(".table").width();
//			this.scrollTable.width(containerWidth-fixedWidth);
			this.scrollTableContainer.width(containerWidth-fixedWidth);
			this.scrollTableContainer.css("left", fixedWidth);
			var scrollTableContainerHeight = this.scrollTableContainer.height();
			this.app.jq(this.rootNode).closest(".table").height(scrollTableContainerHeight);
		}	
	},

    updateClasses: function(){
      var cnt = 1;
      for(var x in this.columns){
        for(var col in this.columns[x].cols){
          this.columns[x].cols[col].removeClass(TableController.CLASS_EVEN);
          if(cnt%2 == 0)this.columns[x].cols[col].addClass(TableController.CLASS_EVEN);

        }
        if(this.columns[x].visible) cnt++;
      }
    },

    handleRootAction: function(view){
      var action = this.getActiveAction(this.rootConfig.action,view);
      this.showingCols(view);
	  this.unfixingCols(view);
      for(var i in action){
        switch(action[i]){
          case 'hideCols' :  this.hidingCols(view); break;
          case 'fixCols' : this.fixingCols(view); break;
        }
      }
      this.updateClasses();
      
    },

    hidingCols: function(view){
      var hide = this.getActiveAction(this.hideCols,view);
      for(var x in hide){
        for(var col in this.columns[parseInt(hide[x])].cols) this.columns[parseInt(hide[x])].cols[col].hide();
        this.columns[parseInt(hide[x])].visible = false;
      }
    },
    
    fixingCols: function(view, scrollPos){
    	var that = this;
		var fixTable = this.app.jq('<table aria-hidden="true" class="fixed"></table>').insertBefore(this.app.jq(this.rootNode));
		var scrollTable = this.app.jq('<table aria-hidden="true" class="scroll"></table>');
		var scrollTableContainer = this.app.jq('<div aria-hidden="true" class="scrollTableContainer"></div>').insertBefore(this.app.jq(this.rootNode));		
				
		this.app.jq(this.rootNode).addClass("hidden");

    	var fix = this.getActiveAction(this.fixCols, view);
    	var fixCols = [];
    	var scrollCols = [];
    	var numTR = this.columns[0].cols.length;
    	
    	this.columns = [];
    	
    	this.app.jq("tr",this.rootNode).each(function(){
	        var row = that.app.jq(this);
	        var colCnt = 0;
	        row.find('td,th').each(function(){
	          if(that.columns[colCnt] == undefined) that.columns[colCnt] = {'cols':[],'visible':true};
	          that.columns[colCnt].cols.push(that.app.jq(this));
	          colCnt++;
	        });
	    });
    		    	
    	for(var i = 0; i < this.columns.length; i++){
    		var col = this.columns[i];
    		if(col.visible){
    			if(this.app.jq.inArray(i.toString(), fix) > -1){
    				fixCols.push(col);
    			}else{
    				scrollCols.push(col);
    			}
    		}	    		
    	}
    	
    	for(var tr = 0; tr < numTR; tr++){
    		if(this.app.jq("tr", fixTable).length < (tr + 1)){
    			this.app.jq("<tr></tr>").addClass(tr == 0 ? "headlines" : "").appendTo(fixTable);
    		}
    		if(this.app.jq("tr", scrollTable).length < (tr + 1)){
    			this.app.jq("<tr></tr>").addClass(tr == 0 ? "headlines" : "").appendTo(scrollTable);
    		}
    	
    		for(var fixCol = 0; fixCol < fixCols.length; fixCol++){
    			//if(tr == 0) fixTable.prepend(this.app.jq("<col></col>"));
    			fixCols[fixCol].cols[tr].clone().appendTo(this.app.jq("tr:nth-child("+ (tr + 1) +")", fixTable)); //nth-child selector start from 1
    		}
    	
    		for(var scrollCol = 0; scrollCol < scrollCols.length; scrollCol++){
    			//if(tr == 0) scrollTable.prepend(this.app.jq("<col></col>"));
    			scrollCols[scrollCol].cols[tr].clone().appendTo(this.app.jq("tr:nth-child("+ (tr + 1) +")", scrollTable));    			   		
    		}    		   	
    	}
    	
    	this.fixTable = fixTable;
    	this.scrollTable = scrollTable;
    	this.scrollTableContainer = scrollTableContainer;
		scrollTableContainer.append(scrollTable);
		//execute adjustWidth() AFTER all the Markup Manipulation is finished
	   	window.setTimeout(function(){
            that.adjustWidth();
            //if(scrollPos) that.scrollTable.scrollLeft(scrollPos);
            if(scrollPos) that.scrollTableContainer.scrollLeft(scrollPos);
        }, 0);

    	this.setSortProxyTriggers();
    },
    
    unfixingCols: function(view){
		this.app.jq(this.rootNode).removeClass("hidden");
		this.app.jq(".scrollTableContainer").remove();
		this.app.jq('table[aria-hidden="true"]').remove();
		this.fixTable = null;
		this.scrollTable = null;
		this.scrollTableContainer = null;
		this.fixed = false;
		this.clearSortProxyTriggers();		 
    },
    
    setSortProxyTriggers: function(){
    	var that = this;
    	this.sortProxyTriggers = this.app.jq("th[" + TableController.HELPER_TRIGGER_NAME + "]", this.app.jq('table[aria-hidden="true"]'));
    	this.sortProxyTriggers.bind('mouseup', function(){    		
    		var triggerConfig = that.app.jq(this).attr("data-ctrl-sort-trigger");
//    		var scrollPos = that.scrollTable.scrollLeft();
    		var scrollPos = that.scrollTableContainer.scrollLeft();
    		for(var i = 0; i < that.sortTriggers.length; i++){
    			if(that.sortTriggers[i].attr("data-ctrl-sort-trigger") == triggerConfig){
    				that.sortTriggers[i].click();
    				that.unfixingCols(that.app.currentView);
    				that.fixingCols(that.app.currentView, scrollPos);
    				
    				return;
    			}
    		}
    	});
    },
    
    clearSortProxyTriggers: function(){
    	if(this.sortProxyTriggers.length > 0){
    		this.sortProxyTriggers.unbind();
    		this.sortProxyTriggers = [];
    	}
    },

    showingCols: function(){
      for(var x in this.columns){
        for(var col in this.columns[x].cols) this.columns[x].cols[col].show();
        this.columns[x].visible = true;
      }
    }
});

/* SORTABLE CONTROLLER */

function SortableController(){};

SortableController.NODE_TYPE = 'sortable';
SortableController.NODE_TYPE_ENTRY = 'entry';
SortableController.NODE_TYPE_ENTRY_KEY = 'key';
SortableController.NODE_TYPE_TRIGGER = 'trigger';

SortableController.CLASS_SORTABLE = 'sortable';
SortableController.CLASS_SORTED = 'sorted';
SortableController.CLASS_REVERSED = 'reversed';

SortableController.prototype = jQuery.extend(new BaseController(), {
    createObject: function(){
        var that = this;
        this.sortArray = [];
        this.sortData = [];
        this.sortKey = false;
        this.reversed = false;
        this.entries = this.getCtrlRelatedObjects(SortableController.NODE_TYPE_ENTRY,this.rootNode);
        this.triggers = this.getCtrlRelatedObjects(SortableController.NODE_TYPE_TRIGGER,this.rootNode);
        for(var i in this.entries){
            var keys = this.getCtrlRelatedObjects([this.entries[i].config.id, SortableController.NODE_TYPE_ENTRY_KEY],this.entries[i].node);
            this.entries[i]['keyText']={};
            this.entries[i]['keyNode']={};
            for(var j in keys){
              this.entries[i]['keyText'][keys[j].config.id] = keys[j]['node'].text().toLowerCase();
              this.entries[i]['keyNode'][keys[j].config.id] = keys[j]['node'];
            }
        }
        for(var t in this.triggers){
          this.triggers[t].node.addClass(SortableController.CLASS_SORTABLE);
        }
        this.bindEventToObjects(this.triggers,'click',function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
        this.handleEventListener();
    },

    handleEventListener: function(){
        this.app.addEventListener(Application.EVENT_CONTENT_ADDED, this, "handleContentAddedEvent");
    },

    handleViewUpdatedEvent: function(view){

    },

    handleViewDiedEvent: function(view){

    },

    handleContentAddedEvent: function(node){
      //this.createObject();
    },

    handleTriggerAction: function(trigger, index){
        var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'sortByKey' :  this.sortByKey(trigger.config.key); break;
            }
        }
        this.setTriggerClasses(trigger);
        return false;
    },

    sortByKey: function(key){
        var sortArray = [],
            count = 0;

        for(var i in this.entries){
            sortArray.push([this.entries[i]['keyText'][key],this.entries[i]]);
        }

        var naturalSort = function (a, b) {
          a = a[0]; b = b[0];
          var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
                  sre = /(^[ ]*|[ ]*$)/g,
                  dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
                  hre = /^0x[0-9a-f]+$/i,
                  ore = /^0/,
                  i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
          // convert all to strings strip whitespace
                  x = i(a).replace(sre, '') || '',
                  y = i(b).replace(sre, '') || '',
          // chunk/tokenize
                  xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
                  yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
          // numeric, hex or date detection
                  xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
                  yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
                  oFxNcL, oFyNcL;
          // first try and sort Hex codes or Dates
          if (yD)
            if ( xD < yD ) return -1;
            else if ( xD > yD ) return 1;
          // natural sorting through split numeric strings and default strings
          for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
              oFxNcL += '';
              oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1;
            if (oFxNcL > oFyNcL) return 1;
          }
          return 0;
        };

        sortArray.sort(naturalSort);

        if(this.sortKey != key) this.reversed = false;
        if(this.sortKey === key) this.reversed = !this.reversed;
        if(this.reversed) sortArray.reverse();
        for(var i in sortArray) this.app.jq(this.rootNode).append(sortArray[i][1]['node']);
        this.sortKey = key;
        this.addKeyClasses(key);
    },

    setTriggerClasses: function(trigger){
        for(var i in this.triggers)
            this.triggers[i]['node'].removeClass(SortableController.CLASS_SORTED).removeClass(SortableController.CLASS_REVERSED);
        trigger['node'].addClass(SortableController.CLASS_SORTED);
        if(this.reversed) trigger['node'].addClass(SortableController.CLASS_REVERSED);
    },

    addKeyClasses: function(key){
      for(var i in this.entries){
        for(var k in this.entries[i]['keyNode']){
          this.entries[i]['keyNode'][k].removeClass(SortableController.CLASS_SORTED);
        }
      }
      for(var i in this.entries){
        this.entries[i]['keyNode'][key].addClass(SortableController.CLASS_SORTED);
      }
    }
});


/* SWAPABLE CONTROLLER */

SwapableController = function(){};

SwapableController.NODE_TYPE = 'swapable';
SwapableController.NODE_TYPE_TRIGGER = 'trigger';
SwapableController.NODE_TYPE_SOURCE = 'source';
SwapableController.NODE_TYPE_TARGET = 'target';
SwapableController.NODE_TYPE_FILTER = 'filter';
SwapableController.NODE_TYPE_INFO = 'info';
SwapableController.NODE_TYPE_FORM = 'form';

SwapableController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
        var that = this;

        this.loaded = {};
        this.disabled = false;
        this.filter = {};
        if(this.rootConfig.filter) this.setFilter(this.rootConfig.filter);

        this.infos = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_INFO,this.rootNode);
        this.sources = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_SOURCE,this.rootNode);
        this.target = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_TARGET,this.rootNode)[0];
        this.triggers = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_TRIGGER,this.rootNode);
        this.filters = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_FILTER,this.rootNode);
        this.forms = this.getCtrlRelatedObjects(SwapableController.NODE_TYPE_FORM,this.rootNode);

        this.postData = this.getPostDataFromForms();

        this.relatedSliders = this.app.findRelatedController(this,SlidableController.NODE_TYPE);
        this.relatedSliders = this.relatedSliders.length > 0 ? this.relatedSliders : false;


        this.currentSource = 0;

        this.active = this.sources[this.currentSource];
        this.makeActive(this.active['node']);

        this.bindEventToObjects(this.triggers, 'click',function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
        this.bindEventToObjects(this.filters, 'click',function(obj,index){
            return that.handleFilterAction(obj,index);
        });
        this.bindEventToObjects(this.sources, 'click', function(obj,index){
            return that.handleSourceAction(obj,index);
        });

        this.handleRootAction('init');
        this.updateInfo();
    },

    handleViewUpdatedEvent: function(view){
        this.handleRootAction(view);
    },

    handleViewDiedEvent: function(view){
        
    },

    handleContentAddedEvent: function(node){

    },

    disable:function(){
        this.disabled = true;
        this.makeInactive(this.active.node);
    },

    enable:function(){
        this.disabled = false;
        this.makeActive(this.active.node);
    },

    handleRootAction: function(view){
        var action = this.getActiveAction(this.rootConfig.action,view);
        this.enable();
        for(var i in action){
            switch(action[i]){
                case 'disable' :  this.disable(); break;
            }
        }
    },

    handleSourceAction: function(source, index){
        if(this.disabled) return true;
        if(this.hasSlider() && this.relatedSliders[0].isSliding) return;
        var action = this.getActiveAction(source.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'load'   :    this.load(index); break;
                case 'slideTo':    this.slideTo(this.currentSource); break;
                case 'addFilter':  if(source.config.filter) this.addFilter(source.config.filter); break;
            }
        }
        this.updateInfo();
        return false;
    },

    handleTriggerAction: function(trigger, index){
        if(this.disabled) return false;
        if(this.hasSlider() && this.relatedSliders[0].isSliding) return;
        var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'loadNext' :  this.loadNext(1); break;
                case 'loadPrev' :  this.loadNext(-1); break;
                case 'slideTo'  :  this.slideTo(this.currentSource); break;
                case 'updatePostData' :  this.postData = this.getPostDataFromForms(); break;
            }
        }
        this.updateInfo();
        return false;
    },

    handleFilterAction: function(filter, index){
        if(this.disabled) return false;
        if(this.hasSlider() && this.relatedSliders[0].isSliding) return;
        var action = this.getActiveAction(filter.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'setFilter':       this.resetFilters(); if(filter.config.filter) this.setFilter(filter.config.filter); this.makeActive(filter.node); break;
                case 'addFilter':       if(filter.config.filter) this.addFilter(filter.config.filter); this.makeActive(filter.node); break;
                case 'resetFilters':    this.resetFilters(); break;
                case 'loadFirstSource': this.handleSourceAction(this.sources[0],0); break;
            }
        }
        this.updateInfo();
        return false;
    },

    loadForm: function(){

    },

    load: function(sourceIndex){
        var that = this;
        this.makeInactive(this.active.node);
        this.active = this.sources[sourceIndex];
        this.currentSource = parseInt(sourceIndex);
        this.makeActive(this.active.node);
        var parentNode = this.target.node[0];

 //       that.target.node.html('<h3>'+that.active.config.title+'</h3><div>'+that.active.config.content+'</div>');
        that.target.node.children('.box').remove();
		newBox = that.active.node.clone();
		newBox.height('auto');
		newBox.removeClass('active');
        that.target.node.append(newBox);
    },

    loadNext: function(direction){
        var next = this.currentSource;
        if(direction > 0){
            if((next + 1) < this.sources.length) next += 1;
            else next = 0;
        }else{
            if((next - 1) >= 0) next -= 1;
            else next = this.sources.length - 1;
        }
        this.load(next);
    },

    hasSlider: function(){
        return this.relatedSliders && this.relatedSliders !== false;
    },

    slideTo: function(sourceIndex){
        if(this.relatedSliders != false) this.relatedSliders[0].slideToChild(this.sources[sourceIndex].node, true);
    },

    setFilter: function(filterObj){
        if(filterObj) this.filter = filterObj;
    },

    addFilter: function(filterObj){
        if(filterObj) for(var i in filterObj) this.filter[i] = filterObj[i];
    },

    resetFilters: function(){
        for(var i in this.filters) this.makeInactive(this.filters[i].node);
        this.filter = {};
    },

    getPostDataFromForms: function(){
        var data = "";
        for(var i in this.forms){
            if(data !== "") data += "&";
            data += this.forms[i].node.serialize();
        }
        return data;
    },

    updateInfo: function(){
        for(var i in this.infos){
            switch(this.infos[i].config.content){
                case 'sourceCounter' : this.infos[i].node.html((this.currentSource+1)+'/'+this.sources.length); break;
                case 'sourceFilter' : this.infos[i].node.html(this.sources[this.currentSource].config.filter); break;
            }
        }
    }
});

/**
 * SocialMediaController
 * Controller zur Steuerung der Anzeige der Empfehlen-iFrames (facebook, twitter, google+) √ºber JS-Cookie und LoadableController.
 * 
 * @Node_Type HTML-Element, das bei Click ein Cookie per JS setzen soll
 * @Node_Signatur (data-ctrl-)socialmedia
 * 
 * @Konfiguartion  {object}    wird als Wert des HTML Attributs "data-ctrl-socialmedia" eingegeben
 *      id               {string} ein einzigartiger string
 * 
 * Verwendung:
 * - Link "Einverstanden" wird als SocialMediaController konfiguriert, onClick wird ein Cookie per JS gesetzt (f√ºr 30 Tage, f√ºr Pfad /)
 *   <a data-ctrl-socialmedia="{'id':'socialMediaRecommendCookie'}" ...
 * - LoadableController muss SocialMediaController als related-Controller enthalten:
 *   data-ctrl-loadable="{'id':'socialLoader',related:['socialMediaRecommendCookie']}"
 * - die erste Source des LoadableController muss f√ºr das Laden des HTMLs mit den iFrames zust√§ndig sein
 * - bei Laden der Seite wird handleSourceAction auf die erste Source des LoadableController aufgerufen, wenn im JS-Cookie socialmedia gesetzt ist 
 * 
 * @Beispiel
 * <div class="box modSocialbar" data-ctrl-collapsible="{'id':'collsocial','action':{'init':['closeEntries']}}" data-ctrl-loadable="{'id':'socialLoader',related:['socialMediaRecommendCookie']}">
 *	<div class="social">
 *		[...]
 *		<div class="likeCon" data-ctrl-socialLoader-target="{'context':'Social'}">
 *			<div class="agreeCon" data-ctrl-collsocial-entry="{'id':'socialRecommend'}">
 *				<div class="button like collapsed" data-ctrl-collsocial-socialRecommend-trigger="{'action':{'default':['toggleBody']}}">
 *					<a href="/testbeitrag100-empfehlen.html">Empfehlen</a>
 *					<div class="fb"></div>
 *					<div class="twitter"></div>
 *					<div class="google"></div>
 *				</div>
 *				<div class="agreement" data-ctrl-collsocial-socialRecommend-body={}>
 *					<p class="text">
 *						<strong>Hinweis zum Datenschutz</strong>
 *						Mit Klick auf "Einverstanden" k√∂nnen Sie diesen Beitrag in sozialen Netzwerken weiterempfehlen.
 *						Dabei besteht die M√∂glichkeit, dass Daten von Ihrem Computer zum jeweiligen Anbieter sowie
 *						Daten des Anbieters auf Ihren Computer√ºbertragen werden.
 *					</p>
 *					<div data-ctrl-socialLoader-source="{'action':{'default':['load']},'url':'/testbeitrag100-empfehlen.html','method':'GET'}" class="button agree">
 *						<a href="#" data-ctrl-socialmedia="{'id':'socialMediaRecommendCookie'}">Einverstanden</a>
 *					</div>
 *				</div>
 *			</div>
 *		</div>
 *		[...]
 *	</div>
 * </div>
 * 
 * @author Martin Kurz <martin.kurz@wdr-mediagroup.com>
 */
"use strict";
function SocialMediaController(){};

SocialMediaController.NODE_TYPE = 'socialmedia';

SocialMediaController.prototype = jQuery.extend(new BaseController(), {
    createObject: function(){
    	this.cookiesAllowed = navigator.cookieEnabled;
    	this.showRecommend = 0;
    	if (this.cookiesAllowed) {
    		var cookies = document.cookie.split('; ');
    		for (var i = 0, l = cookies.length; i < l; i++) {
    			var parts = cookies[i].split('=');
    			if (parts.shift() === SocialMediaController.NODE_TYPE) {
    				this.showRecommend = parts.shift();
    			}
			}
    	}
    	var that = this;
		this.app.jq(this.rootNode).bind('click', function() {
			that.handleClick();
		});
    },
    handleWindowLoadedEvent: function(event){
    	this.relatedLoaderSource = false;
        this.relatedLoader = this.app.findRelatedController(this, SophoraLoadableController.NODE_TYPE);
        
        this.relatedLoader = this.relatedLoader.length > 0 ? this.relatedLoader[0] : false;
        if (this.relatedLoader && this.relatedLoader.sources && this.relatedLoader.sources.length > 0) {
        	this.relatedLoaderSource = this.relatedLoader.sources[0];
        }
    	if (this.showRecommend && this.relatedLoaderSource) {
    		this.relatedLoader.handleSourceAction(this.relatedLoaderSource, 0);
    	}
    },
    handleClick: function() {
    	if (!this.showRecommend) {
    		var expire = new Date();
    		expire.setTime(expire.getTime() + (1 * 24 * 60 * 60 * 1000)); // 1 Tag
    		document.cookie = SocialMediaController.NODE_TYPE + '=1; expires=' + expire.toGMTString() + '; path=/';
    	}
    }
});




/**
 *	SwipeableImagesController
 *	Ein Controller fuer den sogenannten Bildwischer.
 **/


function SwipeableImagesController(){};

SwipeableImagesController.NODE_TYPE = 'swipeableImages';
SwipeableImagesController.NODE_TYPE_TRIGGER = 'trigger';
SwipeableImagesController.NODE_TYPE_SLIDER = 'slider';

SwipeableImagesController.NODE_TYPE_BOTTOM = 'bottom';
SwipeableImagesController.NODE_TYPE_TOP = 'top';


SwipeableImagesController.CLASS_SLIDER = 'swipe';
SwipeableImagesController.CLASS_LABEL_ENTRY = 'entry';

SwipeableImagesController.prototype = jQuery.extend(new BaseController(), {
    createObject: function(){
        this.disabled = false;
        this.manualEnd = false;
        
        this.bottom = this.getCtrlRelatedObjects(SwipeableImagesController.NODE_TYPE_BOTTOM,this.rootNode);
        this.top = this.getCtrlRelatedObjects(SwipeableImagesController.NODE_TYPE_TOP,this.rootNode);
       
        this.triggers = this.getCtrlRelatedObjects(SwipeableImagesController.NODE_TYPE_TRIGGER,this.rootNode);

        for(var i in this.triggers){
            var action = this.getActiveAction(this.triggers[i].config.action,this.app.currentView);
            for(var j in action){
                if(action[j] === 'swipe'){
                    this.triggerSwipe = this.triggers[i].node;
            		
                    var that = this;
                    that._dragging=false;		
                    
                    this.app.jq(this.triggerSwipe).mousedown(function() {   
                    	that._dragging=true;		
                	});
                    
                    this.app.jq(this.triggerSwipe).mouseup(function() {               		
                		that._dragging=false;		
                	});
                   
                    this.app.jq(this.rootNode).mouseup(function() {               		
                		that._dragging=false;		
                	});
                    
                    this.app.jq(this.rootNode).mouseleave(function() {               		
                		that._dragging=false;	
                	});                    

                    this.app.jq(this.top[0]['node']).mousemove(function(e) {                   	
                    	that.dragMe(e);
                	});

                    this.app.jq(this.bottom[0]['node']).mousemove( function(e) {
                		that.dragMe(e);
                	});
                    this.app.jq(this.triggers[i].node).mousemove( function(e) {                   	
            	    	that.dragMe(e);
                	});
                    
                    this.app.jq(this.triggers[i].node).bind("touchstart",function() {
                    	that._dragging=true;	
                    });
                   
                    this.app.jq(this.triggers[i].node).bind("touchend",function() {
                    	that._dragging=false;		
                    });
                    
                    this.app.jq(this.rootNode).bind("touchmove",function(e) {
                    	that.dragMe(e); 
                    });     
                }
            }
        }
        
        that.handleRootAction('init');
    },
    
    
    dragMe: function(e){
    	if(this._dragging){      		
    		e.preventDefault();
    		mouseX = e.pageX;
			mouseY = e.pageY;
			if(!(e.originalEvent.touches === undefined)){				
				touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				mouseX = touch.pageX;
    			mouseY = touch.pageY;    	
    		}
			
			topElement = this.top[0]['node'];
	    	bottomElement = this.bottom[0]['node'];
	    	bottomElementVertical = this.bottom[0]['node'].find('img');
	
	    	if(this.rootConfig.orientation == 'vertical'){
	    		topHeight = topElement.height();
	    		newTopHeight = mouseY - topElement.offset().top;               	    	
    	    	topHeightPercentage = (newTopHeight/bottomElementVertical.height())*100;
  			    		
	    		if(topHeightPercentage<100 && newTopHeight>0){
		    		topElement.height(topHeightPercentage+'%');                		
	    		}
	    	} else {	    		
	    		topWidth = topElement.width();
	    		newTopWidth = mouseX - topElement.offset().left;               	    	
    	    	topWidthPercentage = (newTopWidth/bottomElement.width())*100;

    	    	
	    		if(topWidthPercentage<100 && newTopWidth>0){
	    		topElement.width(topWidthPercentage+'%');                		
	    		}    		
	    		
	    	}
		}
    },

    handleViewUpdatedEvent: function(view){
    },

    handleRootAction: function(view){
        var action = this.getActiveAction(this.rootConfig.action,view);
        this.enable();
    },

    enable: function(){
      this.disabled = false;
    },

    disable: function(){
      this.disabled = true;
    }
});

/**
 *	PixelController
 *	Ein Controller fuer das Tracking der Seitenaufrufe und Aktivitaeten in interaktiven Komponenten.
 *	
 *	@Node_Type	body(Hauptcontroller einer Seite) und/oder div(Controller fuer Komponenten)
 *	@Node_Signatur (data-ctrl-)pixel 
 *
 *	@Konfiguration {object}    wird als Wert des HTML Attributs "data-ctrl-pixel" eingegeben
 *		id	{string}	ein einzigartiger string, dient als Prefix der IDs der zugehoerigen Elemente.
 *		action {object}   ein Objekt, in dem unterschiedliche Aktionen definiert werden
 *			loaded	['initTrack']	wenn der Controller im body Tag ist, werden beim EVENT_WINDOW_LOADED alle Tracking-Elemente initialisiert
 *			init	['iniTrack']	wenn der Controller in einer anderen Komponente oder in einem Link angegeben ist, werden alle Tracking-Elemente erneut initialisiert, wenn sie per Ajax in eine Seite geladen wurden, in der im Body noch kein PixelController initialisiert wurde 
 *			parameter	{object}	Parameter fuer das Tracking
 *	
 *	@Beispiel:
 *	<body data-ctrl-pixel="{'id':'mainPixel', 'action':{'loaded':['initTrack']}, 'parameter':{'IVW':'tatort;98daefa5-cf79-4b9f-9324-f2a59156264c', 'IVW2', '0114_03;p=/unterhaltung/krimi/tatort/tatort-index-komplex-100.html', 'AT':'atinternet'}}">
 *
 *	@Sub-Controller
 *	Kinder-HTML-Elemente im Pixel-HTML-Element, die ein Attribut data-ctrl-{id of pixel controller}-{Sub-Controller-Signatur} haben, um das HTML-Markup in interaktive Pixel-Controller zu verwandeln:
 *		-Trigger: Link oder interaktive Control Elemente
 *			@Node_Type  a, input, button, usw.
 *			@Node_Signatur    (data-ctrl-){id of pixel controller}-trigger
 *			@Konfiguration	{object}	
 *				action	{'default':['sendClickTrack']}	ruft click-Tracking-Methode auf
 *				parameter	{object}	Tracking Einstellungen
 *					(Tracking Variable)
 *					return	true fuer Link, false fuer interaktive Controls
 *			@Beispiel:
 *			<input type="submit"  data-ctrl-v1p1-trigger="{'action':{'default':['sendClickTrack']}, 'parameter':{'var0':'stimme','return':false}}"  data-ctrl-vote1-quiztrigger="{'action':{'default':['submitVote']}}" value="STIMME ABGEBEN">
 */
"use strict";
function TagesschauPixelController(){};

TagesschauPixelController.NODE_TYPE = "tspixel";
TagesschauPixelController.NODE_TYPE_TRIGGER = 'trigger';
TagesschauPixelController.active = true;

//TagesschauPixelController.IVW_TRACKING_URL = 'http://ardsport.ivwbox.de/cgi-bin/ivw/CP/;www.sportschau.de';
TagesschauPixelController.IVW_TRACKING_URL = '';// 'http://tagessch.ivwbox.de/cgi-bin/ivw/CP/tagesschau/tagesschau;page=';
TagesschauPixelController.GESA_TRACKING_URL = '';// 'http://gsea.ivwbox.de/cgi-bin/ivw/CP/0114_05;p=http%3A%2F%2Fwww.tagesschau.de';

TagesschauPixelController.prototype = jQuery.extend(new BaseController(), {
	createObject: function(){
		var that = this;
		this.triggers = this.getCtrlRelatedObjects(TagesschauPixelController.NODE_TYPE_TRIGGER, this.rootNode);
		this.bindEventToObjects(this.triggers, 'click',function(obj,index){
			return that.handleTriggerAction(obj,index);
		});
		this.app.addEventListener(Application.EVENT_SEND_PIXEL,this,'sendClickTrack');
		this.handleRootAction('init');
		this.relatedLoaders = [];
		/**
		 * Verhindere Fehler aus der Abhaengigkeit mit LoadableController
		 */
		if (typeof SophoraLoadableController !== 'undefined') {
			this.relatedLoaders = this.app.findRelatedController(this,SophoraLoadableController.NODE_TYPE);
		}
		this.relatedLoaders = this.relatedLoaders.length > 0 ? this.relatedLoaders : false;
		
		for(var i in this.relatedLoaders) {
			this.relatedLoaders[i].setRelatedIVW(this);
		}
	},
	handleRootAction:function(view){
		var action = this.getActiveAction(this.rootConfig.action, view),
			parameter = this.rootConfig.parameter;
		for(var i in action){
			switch(action[i]){
				case 'initTrack': this.initTrack(parameter); break;
			}
		}
	},
	handleTriggerAction:function(trigger, index){
		var action = this.getActiveAction(trigger.config.action,this.app.currentView),
			parameter = trigger.config.parameter;
		for(var i in action){
			switch(action[i]){
				case 'sendClickTrack': return this.sendClickTrack(parameter); break;
				case 'sendNextClickTrack': return this.sendNextClickTrack(parameter); break;
				case 'sendPrevClickTrack': return this.sendPrevClickTrack(parameter); break;
			}
		}
	},
	handleWindowLoadedEvent: function(eventObj){
		this.handleRootAction('loaded');
	},
	initTrack: function(param){
		this.callPixels(param);
	},
	sendClickTrack: function(param){
		this.callPixels(param);
		return param['return'];
	},
	sendNextClickTrack: function(param){
		this.callPixelByIndex(param, this.relatedLoaders ? this.relatedLoaders[0].currentSource : 0);
		return param['return'];
	},
	sendPrevClickTrack: function(param){
		this.callPixelByIndex(param, this.relatedLoaders ? this.relatedLoaders[0].currentSource : 0);
		return param['return'];
	},
	callPixelByIndex: function(param, index) {
		var newParams = {};
		if (param.IVW) {
			newParams['IVW'] = param.IVW.replace(/%23INDEX%23/g, index);
		}
		if (param.IVW2) {
			newParams['IVW2'] = param.IVW2.replace(/%23INDEX%23/g, index);
		}
		this.callPixels(newParams);
	},
	callPixels: function(param) {
		getivw();
		/*
		if (param.IVW) {
			this.callPixel('ivwPixel1', TagesschauPixelController.IVW_TRACKING_URL + param.IVW + '?r=' + escape(document.referrer) + '&d=' + (Math.random()*100000));
		}
		if (param.IVW2) {
			this.callPixel('ivwPixel2', TagesschauPixelController.GESA_TRACKING_URL + encodeURIComponent(param.IVW2) + '?r=' + escape(document.referrer) + '&k=50&d=' + (Math.random()*100000));
		}
		*/
	},
	callPixel: function(imgId, url) {

		if (!TagesschauPixelController.active) {
			return;
		}
		var ivwImg = this.app.jq('#' + imgId);
		if (ivwImg.length == 0) {
			ivwImg = this.app.jq('<img width="1" height="1" border="0" id="' + imgId + '"/>');
			this.app.jq('.zaehlpixel').append(ivwImg);
		}
		ivwImg.attr('src', url);
	}
});



"use strict";
function rundownController(){};

rundownController.NODE_TYPE = 'rundownPage';
rundownController.NODE_TYPE_ENTRY = 'entry';
rundownController.NODE_TYPE_TRIGGER = 'trigger';
rundownController.NODE_TYPE_SOURCE = 'source';
rundownController.NODE_TYPE_TARGET = 'target';
rundownController.NODE_TYPE_CONTROLLER = 'controller';



rundownController.prototype = objectUtil.extendObject(new BaseController(), {
    createObject: function(){
    	var that = this;
        this.loaded = {};
        this.disabled = false;
        this.backgroundUrl = this.rootConfig.background;
        this.controller = this.getCtrlRelatedObjects(rundownController.NODE_TYPE_CONTROLLER,this.rootNode);
        this.entries = this.getCtrlRelatedObjects(rundownController.NODE_TYPE_ENTRY,this.rootNode);
        this.isScrolling = true;
        this.isLoading = false;
        this.triggers = this.getCtrlRelatedObjects(rundownController.NODE_TYPE_TRIGGER, this.rootNode);
		this.bindEventToObjects(this.triggers, 'click',function(obj,index){
		return that.handleTriggerAction(obj,index);
		});
    },

    handleViewUpdatedEvent: function(view){
        this.handleRootAction(view);
    },

    disable:function(){
        this.disabled = true;
    },

    enable:function(){
        this.disabled = false;
    },

    getEntry: function(array, id) {
        for (var i = 0, len = array.length; i < len; i++) {
        	if (array[i].config.id === id) {
                return array[i];
            }
        }
        return null; //nothing found
    },
    getNextEntry: function(array, id) {
        for (var i = 0, len = array.length; i < len; i++) {
        	if (array[i].config.id === id) {
                return array[i+1];
            }
        }
        return null; //nothing found
    },
    getPrevEntry: function(array, id) {
        for (var i = 0, len = array.length; i < len; i++) {
        	if (array[i].config.id === id) {
                return array[i-1];
            }
        }
        return null; //nothing found
    },
    
    handleRootAction: function(view){
        that = this;        

        var action = this.getActiveAction(this.rootConfig.action,view);
        this.enable();
        newTop = jQuery('.sectionArticle').offset().top;
        jQuery('html, body').animate({scrollTop: 0},200,function(){
        });
        that.isScrolling = false;        	
        if(that.backgroundUrl != undefined){
           	var myVar = that.backgroundUrl.def;
           	jQuery('body').css('background', 'url("'+myVar+'") repeat fixed center center #015E9C');
           	jQuery('body').css('background-size', 'cover');
        }
           
            this.activeEntry = null;
            this.prevEntry = null;
            this.nextEntry = this.entries[0];
    		jQuery(this.entries[0]['node'].children('div.chapter').addClass("controlled"));

            this.app.jq(window).bind("scroll",function(e) {
            	var deviceAgent = navigator.userAgent.toLowerCase();
            	var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
            	if (!agentID) {
            		that.scrollWindow();            	            	 
            	}            	
            });
            this.app.jq(window).bind("touchmove",function(e) {
            	that.scrollWindow();
            });
          
            for(var i in this.entries){ 
            	entry = that.entries[i]['node'];
            	entry.mySrc = that.entries[i]['config']['src'];
            	entry.myID = "#"+that.entries[i]['config']['id'];
            	entry.myContentDiv = jQuery(entry.children('div.snowflake'));
            	entry.myChapterDiv = jQuery(entry.children('div.chapter'));
            	entry._isLoaded = false; 
            	entry._loadable = false;
            	if(entry.myChapterDiv.hasClass("active")){
            		that.activeEntry = that.entries[i];
            	}
            }
            
            for(var i in action){
                switch(action[i]){
                    case 'disable' :  this.disable(); break;
                    case 'loadHash' :  this.loadHash(); break;
                }
            }
        	
            jQuery('#content a').not('a[href^="#"]').not('.dossierlink').attr('target','_blank');
            jQuery('a.dossierlink').attr('href','#');

            setTimeout(function(){
            	if(that.activeEntry != null){
            		that.load_entry(that.activeEntry,0);
            	}
            },500);
    },
    
    handleTriggerAction:function(trigger, index){
    	that = this;
    	var action = this.getActiveAction(trigger.config.action,this.app.currentView);
    	var parameter = trigger.config.id;
		for(var i in action){
			switch(action[i]){
				case 'load': this.load_entry(that.getEntry(that.entries,parameter)); break;
				case 'loadprev': break;
				case 'loadnext': return this.loadnext(); break;
			}
		}
	},
    
    scrollWindow: function(e){
    	/* NAVI FIX */
    	this.controller[0]['node'].css({'position':'relative','z-index':1});
		var floating_navigation_offset_top = this.controller[0]['node'].offset().top;
		var scroll_top = jQuery(window).scrollTop();
		var navheight = jQuery(window).height()-50;		
		if (scroll_top > floating_navigation_offset_top) {
        	this.controller[0]['node'].css({'position':'fixed', 'top':'0px','z-index':10001});
        }
		this.controller[0]['node'].find('ul.subressorts').css({'max-height':navheight});
		
        /* LOAD Chapter or WAIT */
		if(this.isLoading){
			myTop = this.saveTop;
			//jQuery('html, body').animate({scrollTop: myTop}, 0);
		} else { 
			this.load_entries_scroll();
		}
    },
    loadnext: function(){
    	this.load_entry(this.nextEntry);
    },
    loadprev: function(){
   		this.load_entry(this.prevEntry);
    },
   
    entryInViewport: function(entry){
    	if(entry != null){
    		myWindow = jQuery(window);
	    	
	    	entry.myNewTop = entry.node.children('div.chapter').offset().top;
	    	entry.myNewBottom = entry.node.children('div.chapter').offset().top+entry.node.children('div.chapter').height();
	    	entry.scrollBottom = myWindow.scrollTop() + myWindow.height();
	    	entry.snowflakeTop = entry.myNewTop - myWindow.scrollTop();
	    	if(entry.myNewBottom < (entry.scrollBottom-80) && entry.myNewTop > myWindow.scrollTop() ){
	    		return true;
	    	} else {
	    		return false;
	    	}
    	} else {
    		return false;
    	}
    },
    
    load_entry: function(entry,speed){
    		if(speed == null){
    			speed = 200;    			
    		}
    		that = this;
        	that.isLoading = true;
    		if(speed == 0){
    			that.scrollMe = false;
    			that.isScrolling = false;
    		} else {
        		that.scrollMe = true;  
    			that.isScrolling = true;		
    		}
			that.activeEntry = entry;        			
			that.nextEntry = that.getNextEntry(that.entries,entry.config.id);        			
			that.prevEntry = that.getPrevEntry(that.entries,entry.config.id);  
			if(that.nextEntry != null){
				jQuery(that.nextEntry['node']).children('div.chapter').addClass("controlled");
			}
			entry.node.children('div.chapter').addClass("controlled");
			myNewScrollTop = entry.node.children('div.chapter').offset().top;	
			that.saveTop = entry.node.children('div.chapter').offset().top;
			
			entry.node.myChapterDiv.css('visibility', 'visible');
			entry.node.myChapterDiv.fadeTo(100,1);
			
			if(!entry._isLoaded){
				entry.node.myContentDiv.html("<div class=ladeanimation></div>");
				
				if(that.scrollMe){
				jQuery('html, body').animate(
						{scrollTop: myNewScrollTop}, 
							speed,
							function() {										   
							}
						);
				}
				setTimeout(function(){

				jQuery.get( entry.config.src, function( data ) {
						entry.node.myContentDiv.html( data );					
						entry._isLoaded = true;
						entry.node.myContentDiv.css('opacity', '0');
						entry.node.myContentDiv.css('visibility', 'visible');
						if(that.prevEntry != null){
							jQuery(that.prevEntry['node']).children('div.chapter').addClass("controlled");
							myNewScrollTop2 = entry.node.children('div.chapter').offset().top;	
							if(that.scrollMe){
								jQuery('html, body').animate(
									{scrollTop: myNewScrollTop2}, 
										0, 
										function() {										   
										}
									);
							}// if that.scrollMe
	  		            }
						entry.node.myContentDiv.fadeTo(500,1,function(){							
							that.isFading = false;
							that.isLoading = false;
							that.isScrolling = false;				
						});
	  					app.initControllers(entry.node.myContentDiv);
	  					app.registerEvents();
	  		            jQuery('#content a').not('a[href^="#"]').not('.dossierlink').attr('target','_blank');	  		
		  			})
		  			 .fail(function() {
		  			 })
		  			.always(function() {
		  			});

				}, 500);
			} 
			else {
					app.initControllers(this);
					app.registerEvents();
					if(that.scrollMe){
						jQuery('html, body').animate(
						{scrollTop: myNewScrollTop}, 
							speed, 
							function() {										   
								that.isScrolling = false;
							}
						);
					}
					that.isFading = false;
					that.isLoading = false;
					that.activeEntry = entry;
					that.nextEntry = that.getNextEntry(that.entries,entry.config.id);        			
					that.prevEntry = that.getPrevEntry(that.entries,entry.config.id);        	
			}
	},
	
    load_entries_scroll: function(){
    		that = this;
    		nextEntry = that.nextEntry;
        	if(nextEntry != null){
        		nextEntry.inViewport = this.entryInViewport(nextEntry);
	        	if(nextEntry.inViewport && !(that.isLoading || that.isScrolling)){
	        		that.load_entry(that.nextEntry,0);
	        	}
        	}
        	prevEntry = that.prevEntry;
        	if(prevEntry != null){
        		prevEntry.inViewport = this.entryInViewport(prevEntry);
        		if(prevEntry.inViewport && !(that.isLoading || that.isScrolling)){
        			that.load_entry(that.prevEntry,0);
        		}
        	}
	}
});

/**
 * SharingMediaController
 * Controller zur Steuerung der Anzeige der Sharing Icons (facebook, twitter, google+).
 *
 */
"use strict";

function SharingMediaController() {};

SharingMediaController.NODE_TYPE = 'sharingmedia';

SharingMediaController.prototype = jQuery.extend(new BaseController(), {
    createObject: function() {

        // bind events
        this.app.jq('.toggleShare', this.rootNode).bind('click', this.app.jq.proxy(this.handleClick, this));
        this.app.jq(window).scroll(this.app.jq.proxy(this.handleWindowScroll, this));

        // clone shares
        var node = this.app.jq(this.rootNode);
        this.app.jq(".shares", node).clone().appendTo(".fixedSharingContainer");

    },

    handleWindowLoadedEvent: function(event) {

        this.handleWindowScroll();
    },

    handleWindowScroll: function() {
        var that = this;
        var node = this.app.jq(that.rootNode);
        var container = this.app.jq(".fixedSharingContainer");

        var inView = !(node.is(":above-the-top"));
        if (!that.inViewport && inView) {

            container.removeClass('isVisible');
        } else {

            container.addClass('isVisible');

        }
        if (!inView) that.inViewport = false;
    },

    handleClick: function(event) {
        var sharesContainer = this.app.jq(".fixedSharingContainer").find('.shares');
        var imageContainer = this.app.jq(".fixedSharingContainer").find('.toggleShare img');

        sharesContainer.toggleClass('isVisible');

        var src = 'http://www.tagesschau.de/resources/framework/img/base/icon/sharing_toggle.svg';

        if (sharesContainer.hasClass('isVisible')) {
            src = 'http://www.tagesschau.de/resources/framework/img/base/icon/sharing_toggle_active.svg';
        }

        imageContainer.attr('src', src);
    }
});




/**
 * SharingMediaController Tagesschau.de
 * Controller zur Steuerung der Anzeige der Sharing Icons (facebook, twitter, google+) bei Tagesschau.de
 *
 */
"use strict";

function SharingMediaControllerTS() {};

SharingMediaControllerTS.NODE_TYPE = 'sharingmediaTS';
SharingMediaControllerTS.NODE_TYPE_TRIGGER = 'trigger';

SharingMediaControllerTS.prototype = jQuery.extend(new BaseController(), {
    createObject: function() {
        // bind events
    	var that = this;
        this.app.jq('.toggleShare', this.rootNode).bind('click', this.app.jq.proxy(this.handleClick, this));

        this.action = this.rootConfig.action;
        
        this.triggers = this.getCtrlRelatedObjects(SharingMediaControllerTS.NODE_TYPE_TRIGGER,this.rootNode);
        this.bindEventToObjects(this.triggers, 'click',function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
       
        // clone shares
        if(this.action === "fixed" || this.action === "bottomBar"){
        	this.app.jq(window).scroll(this.app.jq.proxy(this.handleWindowScroll, this));
        }
        
    },
    
    handleTriggerAction:function(trigger, index){
    	var that = this;
		var burl = encodeURIComponent(location.href); 
		var btitle = encodeURIComponent(document.title); 
		
		if(trigger.config.url !== undefined){
			burl = trigger.config.url;
		}
		if(trigger.config.title !== undefined){
			btitle = trigger.config.title;
		}
		where = trigger.config.action
    	switch(where) { 
			case 'Twitter': window.open('http://twitter.com/intent/tweet?text='+btitle+'&url='+burl); break; 
			case 'Facebook': window.open('http://www.facebook.com/sharer.php?u='+burl+'&t='+btitle+'&desc='); break; 
			case 'Delicious': window.open('https://secure.delicious.com/post?url='+burl+'&amp;title='+btitle); break; 
			case 'Webnews': window.open('http://www.webnews.de/einstellen?url='+burl+'&title='+btitle); break; 
			case 'Yigg': window.open('http://yigg.de/neu?exturl='+burl); break; 
			case 'StudiVZ': window.open('http://www.studivz.net/Suggest/Selection/?u='+burl+'&desc='+btitle+'&prov=tagesschau.de'); break; 
			case 'GoogleBM': window.open('http://www.google.com/bookmarks/mark?op=edit&bkmk='+burl+'&title='+btitle); break;
    	} 
    
    
    },
	
    handleWindowLoadedEvent: function(event) {
        this.handleWindowScroll();
    },

    handleWindowScroll: function() {
    	if(this.action == "fixed"){
    	var that = this;
        var node = this.app.jq(that.rootNode);
        var container = this.app.jq(".fixedSharingContainer");

        var inView = !(node.is(":above-the-top"));
        if (!that.inViewport && inView) {

            container.removeClass('isVisible');
        } else {
            container.addClass('isVisible');
        }
        if (!inView) that.inViewport = false;
      }
       
       if(this.action == "bottomBar"){
       	   var that = this;
           var node = this.app.jq(that.rootNode);
          
           var container = this.app.jq(".sharingBar .shareCon");
           var container2 = this.app.jq(".modSharing");
           var bottomContainer = this.app.jq(".fixedSharingContainer");
           
           var scrollTop = jQuery(window).scrollTop() + 45;           

//           var storywrapper = this.app.jq(".storywrapper");
//           var storyBottom = storywrapper.offset().top+storywrapper.height() - jQuery(window).scrollTop() - container.height();
          
           if(!container2.is(":above-the-top")){
        	   container.removeClass('isFixed');
               bottomContainer.removeClass('isVisible');
           } else {
               container.addClass('isFixed');
               bottomContainer.addClass('isVisible');
           }
         }
    },

    handleClick: function(event) {

        var sharesContainer = this.app.jq(".fixedSharingContainer").find('.shares');
        var imageContainer = this.app.jq(".fixedSharingContainer").find('.toggleShare img');

        sharesContainer.toggleClass('isVisible');

        var src = 'http://www.tagesschau.de/resources/framework/img/base/icon/sharing_toggle.svg';

        if (sharesContainer.hasClass('isVisible')) {
            src = 'http://www.tagesschau.de/resources/framework/img/base/icon/sharing_toggle_active.svg';
        }

        imageContainer.attr('src', src);
    }

});
