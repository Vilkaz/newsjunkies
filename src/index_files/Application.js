




function Application(jq){
    this.controller = {};
    this.currentKeys = {};
    this.currentView = "";
    this.currentFocus = null;
    this.initialized = false;
    this.listener = {};
    this.garbageCollector = null;
    this.jq = jq.noConflict();
};

Application.EVENT_WINDOW_LOADED = "windowLoaded";

Application.EVENT_FOCUS_UPDATED = "focusUpdated";
Application.EVENT_FOCUS_DIED    = "focusDied";

Application.EVENT_CONTENT_LOADED = "contentLoaded";
Application.EVENT_CONTENT_ADDED = "contentAdded";

Application.EVENT_VIEW_UPDATED  = "viewUpdated";
Application.EVENT_VIEW_DIED     = "viewDied";

Application.EVENT_MOUSE_CLICKED  = "mouseClick";
Application.EVENT_MOUSE_DOWN  = "mouseDown";
Application.EVENT_MOUSE_UP  = "mouseUp";

Application.EVENT_TOUCH_START = "touchStart";
Application.EVENT_TOUCH_MOVE = "touchMove";
Application.EVENT_TOUCH_END = "touchEnd";

Application.EVENT_KEY_PRESS = "keyPress";
Application.EVENT_KEY_DOWN = "keyDown";
Application.EVENT_KEY_UP = "keyUp";

Application.prototype = {
    init: function(){
        this.initialized = true;
    },
    initControllers: function (rootNode){
        //this.registerControllers(LoaderController,rootNode);
        this.registerControllers(LayoutController,rootNode);
        this.registerControllers(AttributeSwapController, rootNode);
        this.registerControllers(SlidableController, rootNode);
        //this.registerControllers(LoadableController, rootNode);
        this.registerControllers(SophoraLoadableController, rootNode);
        this.registerControllers(CollapsibleController, rootNode);
        this.registerControllers(SortableController,rootNode);
        this.registerControllers(FormularController,rootNode);
        this.registerControllers(TableController,rootNode);
        this.registerControllers(QuizableController,rootNode);
        this.registerControllers(IFrameController,rootNode);
        this.registerControllers(SwapableController, rootNode);
        this.registerControllers(SocialMediaController, rootNode);
        this.registerControllers(SwipeableImagesController, rootNode);
        this.registerControllers(TagesschauPixelController, rootNode);
        this.registerControllers(rundownController, rootNode);
        this.registerControllers(SharingMediaController, rootNode);
        this.registerControllers(SharingMediaControllerTS, rootNode);

        TagesschauPixelController.active = true;
    },
    registerEvents: function(){
        var that = this;
        this.jq(window).load(function(e){that.dispatchEvent(Application.EVENT_WINDOW_LOADED,e);});
        if('onkeydown'    in document){ document.onkeydown  = function(evt){var e = evt || window.event; if(!that.currentKeys[e.keyCode]){that.dispatchEvent(Application.EVENT_KEY_DOWN,e);that.currentKeys[e.keyCode] = true;}};}
        if('onkeyup'      in document){ document.onkeyup    = function(evt){var e = evt || window.event; if(that.currentKeys[e.keyCode]){that.dispatchEvent(Application.EVENT_KEY_UP,e);delete(that.currentKeys[e.keyCode]);}};}
        if("ontouchstart" in window || window.navigator.msPointerEnabled){
            var touchStart = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart";
            var touchMove = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
            var touchEnd = window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";
            var touchCancel = window.navigator.msPointerEnabled ? "MSPointerCancel " : "touchcancel";
            window.addEventListener(touchStart, function(e){that.dispatchEvent(Application.EVENT_TOUCH_START,e);},false);
            window.addEventListener(touchMove,  function(e){that.dispatchEvent(Application.EVENT_TOUCH_MOVE,e);},false);
            window.addEventListener(touchEnd,   function(e){that.dispatchEvent(Application.EVENT_TOUCH_END,e);},false);
            window.addEventListener(touchCancel,function(e){that.dispatchEvent(Application.EVENT_TOUCH_END,e);},false);
        }
        var elems = this.jq('body *');
        elems.live("focus",     function(e){that.dispatchEvent(Application.EVENT_FOCUS_UPDATED,e);e.stopPropagation();});
        elems.live("blur",      function(e){that.dispatchEvent(Application.EVENT_FOCUS_DIED,e);   e.stopPropagation();});
        elems.live("click",     function(e){that.dispatchEvent(Application.EVENT_MOUSE_CLICKED,e);});
        if("onmousedown" in window) elems.live("mousedown", function(e){that.dispatchEvent(Application.EVENT_MOUSE_DOWN,this);   e.stopPropagation();});
        if("onmouseup" in window)   elems.live("mouseup",   function(e){that.dispatchEvent(Application.EVENT_MOUSE_UP,this);     e.stopPropagation();});
    },
    registerControllers: function(Controller,rootNode){
        var that = this;
        that.jq("[" + BaseController.NODE_TYPE + '-' + Controller.NODE_TYPE + "]", rootNode).each(function(){
            (function(that,Controller,rootNode){
                that.registerController(Controller, rootNode);
            })(that,Controller,this);
        });
    },
    registerController: function(Controller,rootNode){
        (function(that,Controller,rootNode){
            if(that.controller[Controller.NODE_TYPE] == undefined) that.controller[Controller.NODE_TYPE] = [];
            var controller = new Controller(); controller.init(that, rootNode, Controller.NODE_TYPE);
            if(that.currentView !== '') controller.handleViewUpdatedEvent(that.currentView);
            that.controller[Controller.NODE_TYPE].push(controller);
        })(this,Controller,rootNode);
    },
    findRelatedController: function(controller, type){
        var relatedController = [];
        for(var i in this.controller[type])
            if(this.controller[type][i].isRelatedTo(controller))
                relatedController.push(this.controller[type][i]);
        return relatedController;
    },
    addEventListener: function(event, controller, functionName){
      if(this.listener[event] == undefined) this.listener[event] = [];
      if(this.listener[event])
        for(var i in this.listener[event])
          if(this.listener[event][i].controller === controller && this.listener[event][i].functionName === functionName)
            return;
      this.listener[event].push({'controller':controller,'functionName':functionName});
    },
    removeEventListener: function(event, controller, functionName){
      if(this.listener[event]){
        var remove = [];//var listen = this.listener[event];
        for(var i = this.listener[event].length-1; i>=0; i--){
          if(this.listener[event][i]['controller'] == controller && (this.listener[event][i]['functionName'] === functionName || "all" === functionName )){
            remove.push(i);
          }
        }
        for(var i in remove){
          this.listener[event].splice(remove[i],1);
          //console.log("delEvent: " + event + " " + remove[i]);
        }
      }
    },
    removeAllEventListenerFromCtrl: function(controller){
      for(var event in this.listener)this.removeEventListener(event,controller,"all");
    },
    dispatchEvent: function(event, value){
      if(event == Application.EVENT_VIEW_UPDATED)   this.currentView = value;
      if(event == Application.EVENT_FOCUS_UPDATED)  this.currentFocus  = value.target;
      if(event == Application.EVENT_CONTENT_LOADED) this.initControllers(value);
      if (this.listener[event])
        for(var i in this.listener[event])
          this.listener[event][i].controller[(this.listener[event][i].functionName)](value);
      this.runGarbageCollector();
      //console.log('EVENT: '+event+' || VALUE: '+value);
      //console.dir(value);
    },
    runGarbageCollector: function(){
      var that = this;
      var clearGarbageCollector = function(){
        if(that.garbageCollector !== null){
          window.clearTimeout(that.garbageCollector);
          that.garbageCollector = null;
        }
      };
      clearGarbageCollector();
      this.garbageCollector = window.setTimeout(function(){
        for(var type in that.controller){
          var remove = [];
          for(var i = that.controller[type].length-1; i>=0; i--)
            if(that.controller[type][i].isInDom() == false)
              remove.push(i);
          for(var i in remove){
            that.removeAllEventListenerFromCtrl(that.controller[type][remove[i]]);
            that.controller[type].splice(remove[i],1);
            //console.log("delController "+ remove[i]);
          }
        }
        clearGarbageCollector();
      }, 2500);
    }
};
