/**
 * SlidableController
 * Ein Controller, der ein Slider Control realisiert
 *
 * @Node_Type: <div>
 * @Node_Signatur: (data-ctrl-)slidable
 *
 * @Konfiguration {object} wird als Wert des HTML Attributs "data-ctrl-slidable" eingegeben
 * 		id	{string}	ein einzigartiger string, dient als Prefix der IDs der zugehörigen Elemente (Slider und Slider-Controllers).
 * 						Die Elemente haben dann als Signatur ein HTML Attribut, die jeweils "data-ctrl-{id}-slider" und "data-ctrl-{id}-controls" heißen,
 * 						deren Wert meistens ein leeres Objekt ist.
 * 		related	{array}	ein array der IDs der Elemente, die diese Slidable-Element beeinflussen können. Meistens sind sie Parent oder Ancester-HTML-Elemente.
 * 		action	{object}	ein Objekt, in dem unterschiedliche Aktionen für unterschiedliche View-Größen definiert werden.
 * 			default		{array}	die Aktionen, falls keine Größen-spezifischen Aktionen für die aktuelle View-Größe definiert werden.
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * 			xs		{array}	die Aktionen in View-Größe 'xs'
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * 			s		{array}	die Aktionen in View-Größe 's'
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * 			m		{array}	die Aktionen in View-Größe 'm'
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * 			l		{array}	die Aktionen in View-Größe 'l'
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * 			xl		{array}	die Aktionen in View-Größe 'xl'
 * 								Mögliche Werte im Array: ['disable']: Elemente werden nicht angezeigt und sind nicht interaktiv
 * 														 ['disableWhenNotNeeded']: falls die Breite der Inhalte kleiner ist als die Breite der Elemente,
 * 																				   wird die Slide-Funktionalität deaktiviert und die Slider-Controls werden nicht angezeigt
 * @Sub-Controller
 * 		-Slider: das Container-Element der Inhalte, meistens ist dies auch ein Layoutable Controller
 * 			@Node_Type: <div>
 *			@Node_Signatur: (data-ctrl-){id of slidable controller}-slider
 * 			@Konfiguration: {object} wird als Wert des HTML Attributs "data-ctrl-{id of slidable controller}-slider" eingegeben. Ein leeres Objekt.
 *
 * 		-Controls: das Container-Element der Slider-Controller
 * 			@Node_Type: <div>
 *			@Node_Signatur: (data-ctrl-){id of slidable controller}-controls
 * 			@Konfiguration: {object} wird als Wert des HTML Attributs "data-ctrl-{id of slidable controller}-controls" eingegeben. Ein leeres Objekt.
 *
 * 			-Trigger: die Previous und Next Buttons im Controls-Container
 * 				@Node_Type: <a>
 *				@Node_Signatur: (data-ctrl-){id of slidable controller}-trigger
 * 				@Konfiguration: {object} wird als Wert des HTML Attributs "data-ctrl-{id of slidable controller}-trigger" eingegeben.
 * 					action	{object}	ein Objekt, in dem unterschiedliche Aktionen für unterschiedliche View-Größen definiert werden.
 * 						default		{array}	die Aktionen, falls keine Größen-spezifischen Aktionen für die aktuelle View-Größe definiert werden.
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 * 						xs		{array}	die Aktionen in View-Größe 'xs'
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 * 						s		{array}	die Aktionen in View-Größe 's'
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 * 						m		{array}	die Aktionen in View-Größe 'm'
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 * 						l		{array}	die Aktionen in View-Größe 'l'
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 * 						xl		{array}	die Aktionen in View-Größe 'xl'
 * 											Mögliche Werte in Array: ['slideEntireWidthPrev'] Slider Inhalt wird nach rechts um die Breite eines Slides geschoben
 * 											 						 ['slideEntireWidthNext'] Slider Inhalt wird nach links um die Breite eines Slides geschoben
 *
 * 			-Label: Beschreibung der Slides; zeigen an, welche Slides gerade angezeigt sind, dienen auch als Trigger, um den Slider zu verschieben
 * 				@Node_Type: <div>
 *				@Node_Signatur: (data-ctrl-){id of slidable controller}-label
 * 				@Konfiguration: {object} wird als Wert des HTML Attributs "data-ctrl-{id of slidable controller}-label" eingegeben. Leeres Objekt.
 *
 *
 * @Beispiel
 * <div class="mod modD modMini" data-ctrl-slidable="{'id':'sd67',related:['ld90'],'action':{'default':['disableWhenNotNeeded']}}" >
 *		<div  class="boxCon" aria-live="polite" data-ctrl-sd67-slider="{}" >
 * 		...
 * 		</div>
 *		<div class="controls sliding" data-ctrl-sd67-controls="{}">
 * 			<div class="buttons">
 * 				<a href="#" data-ctrl-sd67-trigger="{'action':{'default':['slideEntireWidthPrev']}}" class="prev"></a>
 * 				<a href="#" data-ctrl-sd67-trigger="{'action':{'default':['slideEntireWidthNext']}}" class="next"></a>
 * 			</div>
 * 			<div class="labels">
 * 				<div class="entries" data-ctrl-sd67-label="{}"></div>
 * 			</div>
 * 		</div>
 * </div>
 */
"use strict";
function SlidableController(){};

SlidableController.NODE_TYPE = 'slidable';
SlidableController.NODE_TYPE_TRIGGER = 'trigger';
SlidableController.NODE_TYPE_SLIDER = 'slider';
SlidableController.NODE_TYPE_LABEL = 'label';
SlidableController.NODE_TYPE_CONTROLS = 'controls';

SlidableController.CLASS_SLIDER = 'slider';
SlidableController.CLASS_LABEL_ENTRY = 'entry';

SlidableController.prototype = jQuery.extend(new BaseController(), {
    /**
     * sliderCount: for slider id generation (useful for multiple iScroll instances in the same document)
     */
    sliderCount: 0,
    createObject: function(){
        var that = this;
        this.si = {};
        this.ti = {};
        this.disabled = false;
        this.currPage = 0;
        this.maxPage = 1;
        this.currScrollX = 0;
        this.isSliding = false;
        this.isTouching = false;
        this.manualEnd = false;
        this.labels = this.getCtrlRelatedObjects(SlidableController.NODE_TYPE_LABEL,this.rootNode);
        this.triggers = this.getCtrlRelatedObjects(SlidableController.NODE_TYPE_TRIGGER,this.rootNode);
        this.controls = this.getCtrlRelatedObjects(SlidableController.NODE_TYPE_CONTROLS,this.rootNode);
        this.sliderNode = this.getCtrlRelatedObjects(SlidableController.NODE_TYPE_SLIDER,this.rootNode)[0]['node'];
        //this.touchInfoImg = this.app.jq('<img src="img/base/icon/slider_touch_info.png"/>').css({'position':'absolute','width':'80px','height':'60px'});
        for(var i in this.triggers){
            var action = this.getActiveAction(this.triggers[i].config.action,this.app.currentView);
            for(var j in action){
                if(action[j] === 'slideEntireWidthPrev'){
                    this.triggerPrev = this.triggers[i].node;
                }
                if(action[j] === 'slideEntireWidthNext'){
                    this.triggerNext = this.triggers[i].node;
                }
            }
        }

        this.initSliderLabel();
        this.bindEventToObjects(this.triggers, 'click',function(obj,index){
            return that.handleTriggerAction(obj,index);
        });
        this.sliderChildren = [];
        this.app.jq(this.sliderNode).children().each(function(){
            var child = {};
            child['node'] = that.app.jq(this);
            child['label'] = that.app.jq('<div></div>').addClass(SlidableController.CLASS_LABEL_ENTRY).css({'cursor':'pointer'});
            for(var i in that.labels) that.labels[i].node.append(child['label']);
            (function(child,that){
                child.label.click(function(){
                    that.slideToChild(child.node,false);
                    return false;
                });
            })(child,that);
            that.sliderChildren.push(child);
        });
        /**
         * for iScroll initialization after window loaded
         */
        this.myScroll = null;
        this.sliderId = "";
        this.sliderContainer = this.app.jq(this.rootNode);
        if(this.sliderContainer.attr("id")){
            this.sliderId = this.sliderContainer.attr("id");
        }else{
            this.sliderId = SlidableController.NODE_TYPE_SLIDER + "-" + (++SlidableController.prototype.sliderCount);
            this.sliderContainer.attr("id", this.sliderId);
        }

      this.sliderNode.css('left','0px').css("width","20000px");
        //this.sliderContainer.addClass("slider");
        that.handleRootAction('init');
      //this.addTouchEventsToSlider();
        
        // 
        this.handleWindowLoadedEvent();
    },

    handleViewUpdatedEvent: function(view){
        if(this.myScroll){
          if(view === "s" || view === "xs") this.manualEnd = true;
          else this.manualEnd = false;
          this.handleRootAction(view);
          this.myScroll.refresh();
          this.updateTriggerClasses();
          this.updateLabel();
        }
    },

    handleViewDiedEvent: function(view){
        this.clearSlider();
    },

    handleWindowLoadedEvent: function(){
      var that = this;
      window.setTimeout(function(){
        that.myScroll = new iScroll(that.sliderId, {hScrollbar: false, snap: true, momentum: true, onBeforeScrollStart: null,
            onScrollEnd: function(){that.afterAni(that);}});
        that.handleRootAction('loaded');
        that.handleViewUpdatedEvent(that.app.currentView);
        that.updateLabel();
        that.updateTriggerClasses();
      },50);
    },

    afterAni: function(that){
        if(that.manualEnd){
            that.myScroll.manualEnd({touches:[], changedTouches:[] ,timeStamp: false});
            that.myScroll._snap(that.myScroll.getScrollX(), 0);
        }
        that.isSliding = false;
        that.calcSliderLabel();
        that.si.sliderOffset = that.myScroll.getScrollX();
        that.updateLabel();
        that.updateTriggerClasses();
    },

    handleRootAction: function(view){
        var action = this.getActiveAction(this.rootConfig.action,view);
        this.enable();
        for(var i in action){
            switch(action[i]){
                case 'disable' :  this.disable(); break;
                case 'disableWhenNotNeeded' :  this.disableWhenNotNeeded(); break;
            }
        }
    },

    enable: function(){
      this.disabled = false;
      this.sliderContainer.css("overflow","hidden").css("position","relative");
      if(this.myScroll){
          this.myScroll.enable();
          this.myScroll.scrollTo(0, 0);
      }
      for(var i in this.controls){
        this.controls[i].node.show();
      }
    },

    disable: function(){
      this.disabled = true;
      if(this.myScroll){
          this.myScroll.disable();
      }
      for(var i in this.controls){
        this.controls[i].node.hide();
      }
      this.sliderContainer.css("overflow","").css("position","");
      this.sliderNode.css('left','0px').css("width","");
    },

    disableWhenNotNeeded: function(){
      //this.calcSliderLabel();
      if(this.app.jq(this.rootNode).outerWidth()+8 >= this.app.jq(this.sliderNode).outerWidth()){
          this.disable();
      }
    },

    handleTriggerAction: function(trigger,index){
        if(this.disabled === true) return false;
        if(!this.isActive(trigger.node)) return false;
        var action = this.getActiveAction(trigger.config.action,this.app.currentView);
        for(var i in action){
            switch(action[i]){
                case 'slideEntireWidthPrev' :  this.slideEntireWidth(-1); break;
                case 'slideEntireWidthNext' :  this.slideEntireWidth( 1); break;
            }
        }
        return false;
    },

    updateTriggerClasses: function(){
        var that = this;
        that.calcSliderLabel();
        if(that.myScroll){
            that.currScrollX = that.myScroll.getScrollX();
        }
        that.triggerPrev.toggleClass("active", (that.currScrollX < 0));
        that.triggerNext.toggleClass("active", (-(that.currScrollX) + that.si.slideWidth < that.si.sliderWidth));
    },

    updateLabel:function(){
        var that = this,
            tol = 2, // wegen rundungsfehler
            maxVisibleOffsetX = that.si.slideWidth - that.si.childWidth;
        for(var x in that.sliderChildren){
            var positionX = that.getChildPosition(that.sliderChildren[x].node);
            //console.log("positionX(" + positionX + ") + tol(" + tol + ") >= 0 && positionX(" + positionX + ") - tol (" + tol + ") <= maxVisibleOffsetX: " + maxVisibleOffsetX);
            that.app.jq(that.sliderChildren[x].label).toggleClass("active", (positionX + tol >= 0 && (positionX - tol <= maxVisibleOffsetX)));

        }
    },

    slideToChild: function(child,slideOneMore){
        if(this.disabled === true) return;
        this.calcSliderLabel();
        var that = this,
            tol = 4,
            maxVisibleOffsetX = that.si.slideWidth - that.si.childWidth,
            childPos = that.getChildPosition(child),
            scrollAbs = 0,
            scrollDir = 0,
            notEnd = false;
        if(childPos <= (0 + tol)){
            scrollAbs = -childPos;
            scrollDir = 1;
            notEnd = child.prev().length > 0;
        }else if(childPos >= (maxVisibleOffsetX - tol)){
            scrollAbs = childPos - maxVisibleOffsetX;
            scrollDir = -1;
            notEnd = child.next().length > 0;
        }

        if(notEnd && slideOneMore){
            scrollAbs += that.si.childWidth;
        }

        if(that.myScroll && (scrollDir !== 0) && (scrollAbs > tol)){
            that.myScroll.scrollTo(that.myScroll.getScrollX() + scrollAbs * scrollDir, 0, 200);
        }
    },

    slideEntireWidth: function(direction){
        var that = this;
        //this.calcSliderLabel();
        that.myScroll.scrollToPage(direction > 0 ? "next" : "prev", 300);
    },

    clearSlider: function(){
        this.si.sliderOffset = 0;
        this.si.slider.css({'left' : this.si.sliderOffset+'px'});
        this.myScroll.refresh();
        this.updateTriggerClasses();
    },

    getChildPosition: function(child){
        var that = this;
        return child.offset().left - that.app.jq(that.rootNode).offset().left;
        //return this.app.jq(child).position().left + this.si.slider.position().left; /* .mod position: relative IE7 Workaround, sonst: - this.si.slider.offset().left; */
    },

    initSliderLabel: function(){
        this.si.slider = this.sliderNode;
        this.si.firstChild = this.si.slider.children().first();
        this.si.lastChild = this.si.slider.children().last();
        this.si.sliderOffset = 0;
        this.si.sliderOffsetLast = 0;
    },

    calcSliderLabel: function(){
        var that = this;
        this.si.childWidth = this.si.firstChild.outerWidth(true);
        this.si.slideWidth = this.app.jq(this.rootNode).outerWidth(true);
        this.si.sliderWidth = this.si.slider.children().length * this.si.childWidth;
        this.si.slider.width(this.si.sliderWidth+'px');
    }
});