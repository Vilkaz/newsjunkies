/*
 *	jQuery ndrslider3
 *  Dies ist ein Test in IntelliJ v4 - Dies ist ein Test
 */

(function( $, window, document, undefined ) {
	
    $.fn.ndrSlider3 = function( action, options ){
    	if(action == null || typeof action === 'object') {
    		
    		/* Action is Null or Object assuming Init - var options not implemented - using data-attributes */
            return this.each(function() {
            	
				var $el=$(this).find('#sliderelement');
				
				if($el.length==0) $el=$(this).css({"overflow":"hidden"});
				else $el.css({"overflow":"hidden"});

				var slider = Object.create( ndrSlider3Class );
				
				slider.init( slider.getUserOptions($(this)), $el );
				$.data( this, 'ndrslider3', slider );
			});  
    	} else {
    		
    		if (action==='jump') {

    			this.data('ndrslider3')['jump'](options.position, false, options.force, options.nolimit, options.disableGallerySliderCheck);
    		} else {
    			
    			/* Generic Call assuming no options */
    			this.data('ndrslider3')[action]();
    		}
    	}
    };
	
    $.fn.ndrSlider3.options = {
    		
    		baseClass : "ndrslider3",
    		theme : "ndrslider3-default-theme",

    		resizeWrapperSelector : '.container',
    		resizeFallbackWrapperSelector : '#page',
        	viewXL : [1279,4, true],
    		viewL : [959,4, true],
    		viewM: [767,3, true],
    		viewS : [479,2, false],
    		viewXS : [400,1,false],  		
    		
    		leftMargin : 48,
    		rightMargin : 48,

    		startPosition : false,
    		elementPosition : 'left',	// left,right center
    		force : 'false',
    		elementSelectionType : 'children',
    		elementSelectionExceptionClass : 'contentbox',
    		elementSelectionExceptionElementClass : 'teaser',
    		elementClass : 'item', 
    		elementHeightSelector : false,

    		gallery : false,
    		galleryElementNavigation : true,
    		gallerySliderType : 'thumb',
        	galleryHeightSelector : '.image-container img',
        	galleryStageWrapper : '<div class="ndrgallerystage"	data-slider-viewxs=\'{ "0":1200, "1":1 , "2":true }\' data-slider=\'{"views" : false, "viewm" :  false, "views" : false, "viewl" : false, "theme":"ndrslider3-gallerystage-theme", "counter":true, "pager":false, "elementNavigation": true, "gallerySliderType" : "stage", "elementHeightSelector" : ".item.active .image-container img", "leftMargin":0, "rightMargin":0}\'>',
    		
        	slideSpeed : 200,
        	pagerSpeed : 600,
        	
        	slideShow : false,
        	jumpToStart : false,
        	jumpToStartSpeed : 400,
        	hoverStop : false,

        	buttonElementPosition : 'gallery',
        	buttonPagingPosition : 'inside',
        	pagerPosition : 'outside',
        	counterPosition : 'inside',
        	pagingNavigation : true,
        	elementNavigation : false,
        	elementClickable : false,
        	pager : true,
        	pagerCounter: false,
        	counter : false,
        	endless : true,

        	elementButtonPrev : '<div class="prev slidercover back"><span class="icon icon_arrow_left"></span></div>',
        	elementButtonNext : '<div class="next slidercover forward"><span class="icon icon_arrow_right"></span></div>',

        	pagingButtonPrev : '<div class="pagingprev slidercover back"><span class="icon icon_arrow_left"></span></div>',
        	pagingButtonNext : '<div class="pagingnext slidercover forward"><span class="icon icon_arrow_right"></span></div>',        	
        	
        	beforeInit: 'slider_beforeinit', // Name of function in scope $.fn.ndrSlider3
        	afterInit: 'slider_afterinit',
        	checkInit: 'slider_checkinit',
        	beforeUpdate: 'slider_beforeupdate',
        	checkUpdate: 'slider_checkinit',
        	afterUpdate: 'slider_afterupdate',
        	beforeMove: false,
        	afterMove: false
    };	
	
    // Special Callbacks - not outsourced
	$.fn.ndrSlider3.slider_beforeinit = function() {

		var that = this; 
		
		if(!that.$elem.closest('.copytext').length!=0 && that.$elem.closest('.stage').length==0) that.$elem.closest('.mt_slider').wrap("<div class=\"modulepadding\">");
	};	    

	$.fn.ndrSlider3.slider_afterinit = function() {

		var that = this; 

		if(that.$elem.hasClass('mt_slider')) that.$elem.find('.teaserpadding').equalize();
		if(that.$elem.hasClass('stage_slider')) that.$elem.find('.teaser').equalize();
	};	   	
	
	$.fn.ndrSlider3.slider_beforeupdate = function() {

		var that = this; 
		
		that.elementsAmount = that.userItems.length;
	};		
	
	$.fn.ndrSlider3.slider_checkinit = function() {

		var that = this; 
			
		if(that.$elem.closest('.nb25').length>0 && that.$elem.closest('.nb25').position().left=='-9999') that.elementsAmount = 0;
	};		
	
	$.fn.ndrSlider3.slider_afterupdate = function() {

		var that = this; 

		if(that.$elem.hasClass('mt_slider')) that.$elem.find('.teaserpadding').equalize();
		if(that.$elem.hasClass('stage_slider')) that.$elem.find('.teaser').equalize();
		
		that.elementsAmount = that.userItems.length;
	};	 
	
	var ndrSlider3Class = {
		init :function(options, el){
			
			var that=this;
            var elem = el;
            var $elem = $(el);
            
            that.$elem = $elem;			
            that.options = $.extend({}, $.fn.ndrSlider3.options, options);

            that.baseClass();
            that.$elem.css({opacity: 0});

            that.wrapperWidth = 0;
            that.currentSlide = 0; 

            if (typeof $.fn.ndrSlider3[that.options.beforeInit]==="function") $.fn.ndrSlider3[that.options.beforeInit].apply(this);
            
			if(that.options.gallery===true) that.initGallery();
            
			if (that.options.elementSelectionType=='class') that.userItems = that.$elem.find('.'+that.options.elementClass);
			else if (that.$elem.hasClass(that.options.elementSelectionExceptionClass)) that.userItems = that.$elem.find('.'+that.options.elementSelectionExceptionElementClass);
			else if(that.options.elementSelectionType=='children' ) that.userItems = that.$elem.children();
             
            that.elementsAmount = that.userItems.length;
            that.wrapItems();

			$(that.userItems[that.currentSlide]).addClass('active');
			if(that.options.gallerySliderType==='stage') $.responsiveImages.m.resizeViewport($(that.userItems[that.currentSlide]),[],true);	
			
            that.playDirection = 'next';

            that.wrapper = that.$elem.find('.wrapper');

            that.isOldIE = document.all && !document.getElementsByClassName; // IE<9
 
            that.checkTouch();          
            that.checkVisible;
			that.updateItems();
			
			if (typeof $.fn.ndrSlider3[that.options.checkInit]==="function") $.fn.ndrSlider3[that.options.checkInit].apply(this);
			
			that.initSizes();
			
    		that.buildControl();
    		that.updateControl();
    		that.response();
    		if(that.options.elements<that.elementsAmount) that.addMoveEvents();
    		that.hoverStop();
    		
    		if(that.options.startPosition!=false) {

    			if(that.options.startPosition > that.maximumSlide) that.options.startPosition = that.maximumSlide;
    			that.jump(that.options.startPosition);
    			that.maximumSlide=that.maximumSlide+1;
    		}
    		
			that.wrapper.css({'display':'block','position':'relative'})

			that.wrapper.imagesLoaded(function( $images, $proper, $broken ) {
				
				$.responsiveImages.m.resizeViewport(that.wrapper);	
				if(that.options.gallerySliderType==='stage') {
					that.wrapper.imagesLoaded(function( $images, $proper, $broken ) {
					
						$.responsiveImages.m.resizeViewport($(that.userItems[that.currentSlide]),[],true);
					});
				}
				
				that.updateControl();
	    		that.play();
				
				if(!that.$elem.is(':visible')) that.watchVisibility();
				else setTimeout( function() { 
					
					//that.jump(that.currentSlide, true,that.options.force,false, true);
					that.$elem.animate({opacity: 1},350); 
				},50);						
				
				that.addEvents();
				
				if (typeof $.fn.ndrSlider3[that.options.afterInit]==="function") $.fn.ndrSlider3[that.options.afterInit].apply(that);
			});
		},

		getUserOptions : function($el) {
			
            var options=$.parseJSON($el.attr('data-slider'));
            
            var galleryStageWrapper=$.parseJSON($el.attr('data-slider-gallerystagewrapper'));
            if(galleryStageWrapper) options.galleryStageWrapper=galleryStageWrapper;
            
            var viewXL=$.parseJSON($el.attr('data-slider-viewxl'));
            if(viewXL) options.viewXL=viewXL;
            
            var viewL=$.parseJSON($el.attr('data-slider-viewl'));
            if(viewL) options.viewL=viewL;

            var viewM=$.parseJSON($el.attr('data-slider-viewm'));
            if(viewM) options.viewM=viewM;
			
            var viewS=$.parseJSON($el.attr('data-slider-views'));
            if(viewS) options.viewS=viewS;

            var viewXS=$.parseJSON($el.attr('data-slider-viewxs'));
            if(viewXS) options.viewXS=viewXS;
            
            return options;
		},
		
		updateData : function(){
		
			var that = this;
			
			if (typeof $.fn.ndrSlider3[that.options.beforeUpdate]==="function") $.fn.ndrSlider3[that.options.beforeUpdate].apply(this);
			
			that.watchVisibility();
			that.updateItems();
			
			if (typeof $.fn.ndrSlider3[that.options.checkUpdate]==="function") $.fn.ndrSlider3[that.options.checkUpdate].apply(this);
			
			that.initSizes();
			that.updatePosition();
			that.updateControl();
			
    		if(that.options.elements<that.elementsAmount) that.addMoveEvents(); else that.removeMoveEvents();
			if(that.options.gallerySliderType!='stage') $.responsiveImages.m.resizeViewport(that.wrapper,[],true);	
			else $.responsiveImages.m.resizeViewport($(that.userItems[that.currentSlide]),[],true);	
    		
    		if (typeof $.fn.ndrSlider3[that.options.afterUpdate]==="function") $.fn.ndrSlider3[that.options.afterUpdate].apply(this);
		},

		reload : function(elements) {
			
			var that = this;
			setTimeout(function(){ that.updateData(); },0)
		},

		watchVisibility : function(){
			
			var that = this;
			clearInterval(that.checkVisible);
			
			if(!that.$elem.is(':visible')){
				
				that.$elem.css({opacity: 0});
				clearInterval(that.slideShowSpeed);
			} else return false;

			that.checkVisible = setInterval(function(){
				
		        if (that.$elem.is(':visible')) {
		        	
		            that.reload();

		            that.$elem.animate({opacity: 1},350);
		            clearInterval(that.checkVisible);
		        }
		    }, 350);
		},

		wrapItems : function(){
			
			var that = this;
			that.userItems.wrapAll("<div class=\"wrapper\">").each(function() {
				$(this).addClass('item');
			});
			
			that.$elem.find(".wrapper").wrap("<div class=\"wrapper-outer\">");
			that.$elem.css("display","block");
		},

		baseClass : function(){
			
			var that = this;
			var hasBaseClass = that.$elem.hasClass(that.options.baseClass);
			var hasThemeClass = that.$elem.hasClass(that.options.theme);

			if(!hasBaseClass) that.$elem.addClass(that.options.baseClass);
			if(!hasThemeClass) that.$elem.addClass(that.options.theme);
		},

		updateItems : function(){
			
			var that = this;
			
			if (that.wrapper.closest(that.options.resizeWrapperSelector).length>0) var width = that.wrapper.closest(that.options.resizeWrapperSelector).width();
			else var width = that.wrapper.closest(that.options.resizeFallbackWrapperSelector).width();

			if(width <= that.options.viewXS[0] && that.options.viewXS !== false) { 
				
				that.options.elements = that.options.viewXS[1]; 
				that.options.showGalleryStage = that.options.viewXS[2]; 
			} else if(width <= that.options.viewS[0] && that.options.viewS !== false) {
				
				that.options.elements = that.options.viewS[1];
				that.options.showGalleryStage = that.options.viewS[2]; 
			} else if(width <= that.options.viewM[0]  && that.options.viewM !== false) {
				
				that.options.elements = that.options.viewM[1];
				that.options.showGalleryStage = that.options.viewM[2]; 
			} else if(width <= that.options.viewL[0] && that.options.viewL !== false) {
				
				that.options.elements = that.options.viewL[1];
				that.options.showGalleryStage = that.options.viewL[2]; 
			} else {
				
				that.options.elements = that.options.viewXL[1];
				that.options.showGalleryStage = that.options.viewXL[2]; 
			}
			
			if(that.options.elements > that.elementsAmount)	that.options.elements = that.elementsAmount;
			
			if(that.options.gallery===true) {
				
				if(that.options.showGalleryStage===false) that.$elem.css({'display' : 'none'});
				else that.$elem.css({'display':'block'});
			}
		},
		
		response : function(){
			
			var that = this;
			var delay;
			
			if(!that.isOldIE) {
				$(window).resize(function(){

					waitForFinalEvent(function(){
					
						if(that.options.slideShow !== false) clearInterval(that.slideShowSpeed);
						clearTimeout(delay);
						delay = setTimeout(function(){ that.updateData(); },100);
					}, 150, Math.floor(Math.random()*10000));
				});
			}
			
		},
		
		updatePosition : function(){
			
			var that = this;

			if(window.css3dSupport === true){
				
				if(that.positionsInArray[that.currentSlide] > that.maximumPixels) that.transition(that.positionsInArray[that.currentSlide]);
				else {
					that.transition(0);
					that.currentSlide = 0;
				}
			} else{
				
				if(that.positionsInArray[that.currentSlide] > that.maximumPixels) that.ani(that.positionsInArray[that.currentSlide]);
				else {
					that.ani(0);
					that.currentSlide = 0;
				}
			}
			if(that.options.slideShow !== false) that.slideShow();
		},

		initGallery : function() {
			
			var that = this;
			
			var holder=that.$elem.closest('.ndrgallery')
			holder.before(that.options.galleryStageWrapper);
			holder.parent().find('.ndrgallerystage').html(holder.html());
			holder.parent().find('.ndrgallerystage').ndrSlider3();
		},
		
		initCounter : function() {
			
			var that = this;

			if(that.options.counterPosition === 'inside') that.counterControl=$("<div class=\"counter\"/>").appendTo(that.$elem.find('.wrapper-outer .control'));
			else if(that.options.counterPosition === 'gallery')  that.counterControl=$("<div class=\"counter\"/>").appendTo(that.$elem.find('.gallerystage .control'));
			else that.counterControl=$("<div class=\"counter\"/>").appendTo(that.$elem.find('.control.outer'));			
			
			that.counterControl.html(that.options.counterContainer);
			that.jumpCounter(that.currentSlide);
		},
		
		initSizes : function(){
			
			var that = this;
            var roundPages = 0;

			if(that.options.elements===that.elementsAmount) margin=0;
			else var margin = that.options.leftMargin+that.options.rightMargin;

            var sliderWidth=that.$elem.width();
            
			that.itemWidth = Math.round((sliderWidth-margin)/that.options.elements);
			var width = that.userItems.length * that.itemWidth - margin;

			// log('Item Width: '+that.itemWidth,3);
			// log(width,3);

			if(that.options.elementPosition==='left') that.positionOffset=0;
			else if(that.options.elementPosition==='center') that.positionOffset=parseInt((sliderWidth-that.itemWidth-margin)/2);			
			else if(that.options.elementPosition==='right') that.positionOffset=sliderWidth-that.itemWidth-margin;			

			that.wrapper.css({ "width": width*2, "left": "-"+margin+that.positionOffset });	
            if(window.css3dSupport === true) that.transition(0); else that.staticPosition(0);
			var lastItem = that.elementsAmount - that.options.elements;

			that.userItems.each(function(index) {
				
				$(this).attr('style', 'width:'+that.itemWidth+'px !important;').data("item",Number(index));
				if(index % that.options.elements === 0 || index === lastItem) { if(!(index > lastItem)) roundPages +=1; }
				$(this).data("roundPages",roundPages);
			});
			
			that.positionsInArray = [0];
			var elWidth = 0;

			for(var i = 0; i<that.elementsAmount; i++) {
				
				elWidth += that.itemWidth;
				that.positionsInArray.push(-elWidth)
			}

			if(that.options.elementPosition=='center') var offset=Math.floor(that.options.elements/2);
			else var offset=0;
			
			that.maximumSlide = that.elementsAmount - that.options.elements + offset;
			that.maximumPixels = (((that.elementsAmount * that.itemWidth) - that.options.elements * that.itemWidth) + offset * that.itemWidth)* -1;
			
			
		},

		buildControl : function() {
			var that = this;

			if ((that.options.buttonElementPosition === 'outside' && that.options.elementNavigation === true) || 
				(that.options.buttonPagingPosition === 'outside' && that.options.pagingNavigation === true) || 
				(that.options.counterPosition === 'outside' && that.options.counter === true) || 
				(that.options.pagerPosition === 'outside' && that.options.pager === true)) {
				
					$("<div class=\"control outer\"/>").toggleClass("clickable", !that.isTouch).appendTo(that.$elem);
			}
			if ((that.options.buttonElementPosition === 'inside' && that.options.elementNavigation === true) || 
				(that.options.buttonPagingPosition === 'inside' && that.options.pagingNavigation === true) || 
				(that.options.counterPosition === 'inside' && that.options.counter === true) || 
				(that.options.pagerPosition === 'inside' && that.options.pager === true)) {
				
					$("<div class=\"control\"/>").toggleClass("clickable", !that.isTouch).appendTo(that.$elem.find('.wrapper-outer'));
			}
			
			
			if (that.options.gallery===true && 
				(that.options.buttonElementPosition === 'gallery' && that.options.elementNavigation === true) || 
				(that.options.buttonPagingPosition === 'gallery' && that.options.pagingNavigation === true) || 
				(that.options.counterPosition === 'gallery' && that.options.counter === true) || 
				(that.options.pagerPosition === 'gallery' && that.options.pager === true)) {
				
					$("<div class=\"control\"/>").toggleClass("clickable", !that.isTouch).appendTo(that.$elem.find('.gallerystage'));
			}
					
			
			if(that.options.pager === true) that.buildPager();
			if(that.options.counter===true) that.initCounter();
			if(that.options.pagingNavigation === true) that.buildPagingButtons();
			if(that.options.elementNavigation === true) that.buildElementButtons();
		},

		buildElementButtons : function(){
			var that = this;

			if(that.options.buttonElementPosition === 'inside') that.elementControl=$("<div class=\"buttons\"/>").appendTo(that.$elem.find('.wrapper-outer .control'));
			else if(that.options.buttonElementPosition === 'gallery')  that.elementControl=$("<div class=\"buttons\"/>").appendTo(that.$elem.find('.gallerystage .control'));
			else that.elementControl=$("<div class=\"buttons\"/>").appendTo(that.$elem.find('.control.outer'));

			that.elementControl.append(that.options.elementButtonPrev).append(that.options.elementButtonNext);
			that.elementButtonPrev=that.elementControl.find('.prev');
			that.elementButtonNext=that.elementControl.find('.next');
			
			that.elementControl.on('click', ".slidercover", function(event){

				event.preventDefault();
				if($(this).hasClass('next')) {
					
					if(that.options.endless === true && $(this).hasClass('endless')) {
						
						that.jump(0, true,that.options.force);
					} else {
						
						that.next(that.options.slideSpeed, that.options.force);
					}
				} else if($(this).hasClass('prev')) { 

					if(that.options.endless === true && $(this).hasClass('endless')) {
							
						that.jump(that.maximumSlide, true,that.options.force);
					} else {
						
						that.prev(that.options.slideSpeed, that.options.force);
					}
				}
			})
		},
	
		buildPagingButtons : function(){
			var that = this;
			
			if(that.options.buttonPagingPosition === 'inside') that.pagingControl=$("<div class=\"pagingbuttons\"/>").appendTo(that.$elem.find('.wrapper-outer .control'));
			else if(that.options.buttonPagingPosition === 'gallery')  that.pagingControl=$("<div class=\"pagingbuttons\"/>").appendTo(that.$elem.find('.gallerystage .control'));
			else that.pagingControl=$("<div class=\"pagingbuttons\"/>").appendTo(that.$elem.find('.control.outer'));

			that.pagingControl.append(that.options.pagingButtonPrev).append(that.options.pagingButtonNext);
			that.pagingButtonPrev=that.pagingControl.find('.pagingprev');
			that.pagingButtonNext=that.pagingControl.find('.pagingnext');
			
			that.pagingControl.on('click', ".slidercover", function(event){

				event.preventDefault();			
				
				if($(this).hasClass('pagingnext') || $(this).find('.pagingnext').length>0) {
				
					if(that.options.endless === true && ($(this).hasClass('endless') || $(this).find('.pagingnext').hasClass('endless'))) {
						
						that.jump(0, true,that.options.force);
					} else {
						
						that.nextPage(that.options.slideSpeed, that.options.force);
					}
				} else if($(this).hasClass('pagingprev') || $(this).find('.pagingprev').length>0) { 

					if(that.options.endless === true && ($(this).hasClass('endless') || $(this).find('.pagingprev').hasClass('endless'))) {
							
						that.jump(that.maximumSlide, true,that.options.force);
					} else {
						
						that.prevPage(that.options.slideSpeed, that.options.force);
					}
				}				
				
				
				// if($(this).hasClass('pagingnext') || $(this).find('.pagingnext').length>0) that.nextPage(that.options.slideSpeed, that.options.force);
				// else if($(this).hasClass('pagingprev') || $(this).find('.pagingprev').length>0) that.prevPage(that.options.slideSpeed, that.options.force);
				
				/* ZPIX ausloesen */
				countPixel("jsndrGallery");
			})
		},		
		
		buildPager : function(){
			var that = this;
	
			if(that.options.pagerPosition === 'inside') that.pagerControl=$("<div class=\"pager\"/>").appendTo(that.$elem.find('.wrapper-outer .control'));
			else if(that.options.pagerPosition === 'gallery')  that.pagerControl=$("<div class=\"pager\"/>").appendTo(that.$elem.find('.gallerystage .control'));
			else that.pagerControl=$("<div class=\"pager\"/>").appendTo(that.$elem.find('.control.outer'));
			
			that.pagerControl.on('click', ".page", function(event){

				event.preventDefault();
				if(Number($(this).data("page")) !== that.currentSlide){
					that.jump( Number($(this).data("page")), true,that.options.force);
				}
			})
		},	
		
		updatePager : function(){
			
			var that = this;
			var counter = 0;
			var lastPage = that.elementsAmount - that.elementsAmount % that.options.elements;
			
			if(that.options.elementPosition==='center') var amount=that.elementsAmount+Math.round((that.options.elements/2));
			else var amount=that.elementsAmount;

			var lastPage = amount - amount % that.options.elements;

			that.pagerControl.off('click', ".page");			
			
			if(that.options.pager === false) return false;

			that.pagerControl.html("");

			for(var i = 0; i<amount; i++){
				
				if(i % that.options.elements === 0){
					
					counter +=1;
					if(lastPage === i) var lastItem = amount - that.options.elements;
					
					var pagerButton = $("<div/>",{ "class" : "page" });
					var pagerButtonInner = $("<span></span>",{
						"text": that.options.pagerCounter === true ? counter : "",
						"class": that.options.pagerCounter === true ? "counter" : ""
					});
					
					pagerButton.append(pagerButtonInner);
					pagerButton.data("page",lastPage === i ? lastItem : i);
					pagerButton.data("roundPages",counter);
					that.pagerControl.append(pagerButton);
				}
			}
			
			that.pagerControl.on('click', ".page", function(event){

				event.preventDefault();
				if(Number($(this).data("page")) !== that.currentSlide){
					that.jump( Number($(this).data("page")), true,that.options.force);
				}
			})			
			
			that.checkPager();
		},
		
		checkPager : function(){
			var that = this;

			if(that.options.elementPosition==='center') {
				that.pagerControl.find(".page").each(function(i,v){

					if(that.options.elementPosition==='center') var amount=that.elementsAmount+Math.floor((that.options.elements/2))-1;
					else var amount=that.elementsAmount-1;					

					if (that.currentSlide<that.maximumSlide) var slide=that.currentSlide;
					else var slide=that.currentSlide;
					
					var page=(( slide * Math.floor(amount / that.options.elements ) )) / amount;
					if (page>Math.floor(page)) page=Math.floor(page)+1;
					
					if(i === page){
						
						that.pagerControl.find(".page").removeClass("active");
						$(this).addClass("active");
					} 
				});			
			} else {
				that.pagerControl.find(".page").each(function(i,v){
					
					if($(this).data("roundPages") === $(that.userItems[that.currentSlide]).data("roundPages") ){
						
						that.pagerControl.find(".page").removeClass("active");
						$(this).addClass("active");
					} 
				});			
			}
		},

		checkGallerySlider : function(position) {
			
			var that = this;
			
			if(that.options.gallerySliderType === 'thumb') var slider=that.$elem.closest('.ndrgallery').parent().find('.ndrgallerystage').ndrSlider3('jump', {
				'position' : position,
				'disableGallerySliderCheck' : true,
				'nolimit' : true
			});
			
			if(that.options.gallerySliderType === 'stage') var slider=that.$elem.closest('.ndrgallerystage').parent().find('.ndrgallery').ndrSlider3('jump', {
				'position' : position,
				'disableGallerySliderCheck' : true,				
				'nolimit' : false
			});
		},
		
		checkNavigation : function(){
			var that = this;

			if(that.options.elementPosition==='center') var offset=Math.floor(that.options.elements/2);
			else var offset=0;			

			if(that.options.pagingNavigation === true){

				if(that.options.force === true) var max = (that.elementsAmount - 1) - (that.elementsAmount % that.options.elements) + offset ;
				else var max=that.maximumSlide;				

				if(that.currentSlide === 0 && max === 0){
	            
					that.pagingButtonPrev.addClass('disabled');
	                that.pagingButtonNext.addClass('disabled');
		        } else if(that.currentSlide === 0 && max !== 0){
		        	
					if(that.options.endless === true) {

						that.pagingButtonPrev.removeClass('disabled');
						that.pagingButtonPrev.addClass('endless');
					} else {
						
			        	that.pagingButtonPrev.addClass('disabled');
					}
					
		        	that.pagingButtonNext.removeClass('disabled endless');
				} else if (that.currentSlide >= max){
					
					that.pagingButtonPrev.removeClass('disabled endless');
					
					if(that.options.endless === true) {
						
						that.pagingButtonNext.removeClass('disabled');
						that.pagingButtonNext.addClass('endless');						
					} else {
						
						that.pagingButtonNext.addClass('disabled');
					}
				} else if(that.currentSlide !== 0 && that.currentSlide !== max){
					
					that.pagingButtonPrev.removeClass('disabled endless');
					that.pagingButtonNext.removeClass('disabled endless');
				}
			}

			if(that.options.elementNavigation === true){
				
				if((that.options.gallery === true && that.options.galleryElementNavigation === true) || that.options.force === true) var max = (that.elementsAmount - 1) - offset ;
				else var max=that.maximumSlide;
				
				if(that.currentSlide === 0 && max === 0){
	                
					that.elementButtonPrev.addClass('disabled');
	                that.elementButtonNext.addClass('disabled');
		        } else if(that.currentSlide === 0 && max !== 0){
	                
		        	that.elementButtonPrev.addClass('disabled');
	                that.elementButtonNext.removeClass('disabled');
				} else if (that.currentSlide === max){
					
					that.elementButtonPrev.removeClass('disabled');
					that.elementButtonNext.addClass('disabled');
				} else if(that.currentSlide !== 0 && that.currentSlide !== max){
					
					that.elementButtonPrev.removeClass('disabled');
					that.elementButtonNext.removeClass('disabled');
				}
			}
		
			return false;
		},

		updateControl : function(){
			
			var that = this;
			
			if(that.options.pager === true) that.updatePager();
			that.checkNavigation();
			
			if(that.options.elements === that.elementsAmount){
				
				if(that.options.elementNavigation==true) that.elementControl.hide();
				if(that.options.pagingNavigation==true) that.pagingControl.hide();
				if(that.options.pager===true) that.pagerControl.hide();			
			} else {
				
				if(that.options.elementNavigation==true) that.elementControl.show();
				if(that.options.pagingNavigation==true) that.pagingControl.show();
				if(that.options.pager===true) that.pagerControl.show();					
			}
			
			if(that.options.elementHeightSelector!=false) {
				
				var elementHeight=that.$elem.find(that.options.elementHeightSelector).height();
				
				if(that.options.elementNavigation==true) that.elementControl.find('.slidercover').height(elementHeight);
				if(that.options.pagingNavigation==true) that.pagingControl.find('.slidercover').height(elementHeight);
			} else {
				
				if(that.options.elementNavigation==true) that.elementControl.find('.slidercover').height('');
				if(that.options.pagingNavigation==true) that.pagingControl.find('.slidercover').height('');
			}
		},

		destroyControl : function(){
			
			var that = this;
			
			if(that.$elem.find('.wrapper-outer .control')) that.$elem.find('.wrapper-outer .control').remove();
			if(that.$elem.find('.gallerystage .control'))  that.$elem.find('.gallerystage .control').remove();
			if (that.$elem.find('.control.outer')) that.$elem.find('.control.outer').remove();
		},

		nextPage : function(speed,force,nolimit){
			var that = this;

			that.currentSlide += that.options.elements;
			if (force!=true) {
				if(that.currentSlide > that.maximumSlide) that.currentSlide = that.maximumSlide; 
			} 
			
			that.jump(that.currentSlide,speed,force,nolimit);
		},

		prevPage : function(speed,force,nolimit){
			
			var that = this;
			that.currentSlide -= that.options.elements;
			if(that.currentSlide < 0) that.currentSlide = 0;
			that.jump(that.currentSlide,speed,force,nolimit);
		},		
		
		next : function(speed,force,nolimit){
			
			var that = this;
			that.currentSlide += 1;

			if(that.currentSlide > that.elementsAmount-1){
				that.currentSlide = that.elementsAmount-1;
				return false;
			}			
			
			that.jump(that.currentSlide,speed,force,nolimit);
		},

		prev : function(speed,force,nolimit){
			
			var that = this;
			that.currentSlide -= 1;

			if(that.currentSlide < 0){
				that.currentSlide = 0;
				return false;
			}				

			that.jump(that.currentSlide,speed,force,nolimit);
		},

		jump : function(position,pager,force,nolimit,disableGallerySliderCheck){
			
			var that = this;

			if (typeof $.fn.ndrSlider3[that.options.beforeMove]==="function") $.fn.ndrSlider3[that.options.beforeMove].apply(this);
        	
			if(force===true || that.options.gallery===true) that.currentSlide = position;
			if(that.currentSlide>=that.elementsAmount) that.currentSlide=that.elementsAmount-1;
			
			if(nolimit===true) {
				if( position <= 0 ) position = 0;
			} else {
				if(position >= that.maximumSlide) position = that.maximumSlide;
				else if( position <= 0 ) position = 0;
			}
			
			
			if(force!=true && that.options.gallery!=true) that.currentSlide = position;


			that.userItems.removeClass('active');
			$(that.userItems[that.currentSlide]).addClass('active');
			
			if(that.options.gallerySliderType==='stage') $.responsiveImages.m.resizeViewport($(that.userItems[that.currentSlide]),[],true);	
			
			var jumpPixel = that.positionsInArray[position];

			if(window.css3dSupport === true){
				that.transitionFinished = false;

				if(pager === true){
					that.swapTransitionSpeed("pagerSpeed");
					setTimeout(function() { that.transitionFinished = true; }, that.options.pagerSpeed);

    			} else if(pager === "jumpToStart" ){
    				
    				that.swapTransitionSpeed(that.options.jumpToStartSpeed);
    				setTimeout(function() { that.transitionFinished = true; }, that.options.jumpToStartSpeed);
    			} else {
    				
					that.swapTransitionSpeed("slideSpeed");
					setTimeout(function() { that.transitionFinished = true; }, that.options.slideSpeed);
				}
				that.transition(jumpPixel);
			} else {
				
				if(pager === true) that.ani(jumpPixel, that.options.pagerSpeed);
				else if(pager === "jumpToStart" ) that.ani(jumpPixel, that.options.jumpToStartSpeed);
				else that.ani(jumpPixel, that.options.slideSpeed);
			}
			
			if(that.options.counter===true) that.jumpCounter(that.currentSlide);
			if(that.options.pager === true) that.checkPager();
			if(that.options.gallery===true || that.options.gallerySliderType === 'stage') {
				
				if(typeof disableGallerySliderCheck==='undefined') disableGallerySliderCheck=false;
				if(disableGallerySliderCheck===false) that.checkGallerySlider(that.currentSlide);
			}
			if(that.options.navigation === true) that.checkNavigation();
			if(that.options.slideShow !== false) that.slideShow();
			if (typeof $.fn.ndrSlider3[that.options.afterMove]==="function") $.fn.ndrSlider3[that.options.afterMove].apply(this);
			that.checkNavigation();
		},

		jumpCounter : function(position) {
			
			var that = this;
			
			that.$elem.find('.counter').html((position+1)+'/'+that.elementsAmount);
		},

		stop: function(){
			
			var that = this;
			that.slideShowStatus = "stop";
			clearInterval(that.slideShowSpeed);
		},

		slideShow : function(){
			
			var that = this;
			if(that.slideShowStatus !== "stop") that.play();
		},

		play : function(){
			
			var that = this;

			if(that.options.slideShow === false) return false;
			
			that.slideShowStatus = "play";

			clearInterval(that.slideShowSpeed);
			that.slideShowSpeed = setInterval(function(){
				
				if(that.options.gallery===true) {
					
					var force=true;
					var max=that.elementsAmount-1;
				} else { 
					
					var force=that.options.force;
					var max=that.maximumSlide; 
				}
				
				if(that.currentSlide < max && that.playDirection === "next") that.next(true,force);
				else if(that.currentSlide === max){
					
					if(that.options.jumpToStart === true) that.jump(0,"jumpToStart");
					else {
						
						that.playDirection = "prev";
						that.prev(true);
					}
				} else if(that.playDirection === "prev" && that.currentSlide > 0) that.prev(true);
				else if(that.playDirection === "prev" && that.currentSlide === 0) {
					
					that.playDirection = "next";
					that.next(true);
				}
			},that.options.slideShow)	
		},

		swapTransitionSpeed : function(action){
			
			var that = this;
			if(action === "slideSpeed") that.wrapper.css(that.addTransition(that.options.slideSpeed));
			else if(action === "pagerSpeed" ) that.wrapper.css(that.addTransition(that.options.pagerSpeed));
			else if(typeof action !== "string") that.wrapper.css(that.addTransition(action));
		},

        addTransition : function(speed){
		
        	return {
                "-webkit-transition": "all "+ speed +"ms ease",
				"-moz-transition": "all "+ speed +"ms ease",
				"-o-transition": "all "+ speed +"ms ease",
				"-ms-transition": "all "+ speed +"ms ease",
				"transition": "all "+ speed +"ms ease"
            };
        },
        removeTransition : function(){
        	
			return {
                "-webkit-transition": "",
				"-moz-transition": "",
				"-o-transition": "",
				"-ms-transition": "",
				"transition": ""
            };
        },

        doTranslate : function(pixels){
        	
			return { 
                "-webkit-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-moz-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-o-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-ms-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "transform": "translate3d("+pixels+"px, 0px,0px)"
            };
        },

        transition : function(value){
        	
			var that = this;
			if(that.options.elements!=that.elementsAmount) value=value+that.options.leftMargin;
			value=value+that.positionOffset;
			
			that.wrapper.css(that.doTranslate(value));
		},

		staticPosition : function(value){
			
			var that = this;
			if(that.options.elements!=that.elementsAmount) value=value+that.options.leftMargin;
			value=value+that.positionOffset;
			
			that.wrapper.css({"left" : value});
		},

		ani : function(value,speed){
			
			var that = this;
			if(that.options.elements!=that.elementsAmount) value=value+that.options.leftMargin;
			value=value+that.positionOffset;
			
			that.animateFinished = false;

			that.wrapper.stop(true,true).animate({ "left" : value }, {
				duration : speed || that.options.slideSpeed ,
			    complete : function(){ that.animateFinished = true; }
			});
		},
		
		checkTouch : function(){
			
			var that = this;
			that.isTouch = ("ontouchstart" in document.documentElement);

		},

		addMoveEvents : function(){
			
			var that = this;
			that.setEvents();
			that.movement();
			that.preventEvents();
		},

		removeMoveEvents : function(){
			
			var that = this;
			
			that.$elem.off(that.event['start']);
			that.$elem.off(that.event['move']);
			that.$elem.off(that.event['end']);
			
			that.$elem.off('dragstart.ndrslider3','img');
			that.$elem.off('mousedown.disableTextSelect');
		},		
		
		setEvents : function(){
			
			var that = this;
			var events;

			that.event = {};

			if(that.isTouch) {
	            events = [
	                'touchstart.ndrslider3',
	                'touchmove.ndrslider3',
	                'touchend.ndrslider3'
	                ];
        	} else {
	            events = [
	                'mousedown.ndrslider3',
	                'mousemove.ndrslider3',
	                'mouseup.ndrslider3'
	                ];
        	}
			
	        that.event['start'] = events[0];
	        that.event['move'] = events[1];
	        that.event['end'] = events[2];

		},

		preventEvents :  function(){
			var that = this;
			if(that.isTouch !== true){
				that.$elem.on('dragstart.ndrslider3',"img", function(e) { e.preventDefault();});
				that.$elem.on('mousedown.disableTextSelect', function() {return false;});
    		}
		},

		movement : function(){
			
			var that = this;

			var settings = {
            	position: null,
            	sliding : null,
            	minSwipe : null,
            	maxSwipe: null,
            	offsetX : 0,
            	offsetY : 0,
            	thatElWidth : 0,
            	relativePos : 0
			}

			that.animateFinished = true;

			function disableClick(e){
				
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				that.wrapper.off('click.ndrslider3');
			}			

			function toggleEvents(status){
				
				if(status === "on"){
					
					$(document).on(that.event['move'], dragMove);
	        		$(document).on(that.event['end'], dragEnd);
	        	} else if(status === "off"){
	        		
					$(document).off(that.event['move']);
            		$(document).off(that.event['end']);
            	}
			}

			function getTouches(e){
				
				if(that.isTouch === true) return { x : e.touches[0].pageX, y : e.touches[0].pageY }
				else if(e.pageX !== undefined) return { x : e.pageX, y : e.pageY }
				else return { x : e.clientX, y : e.clientY }
			}
			
			function dragStart(e) {
				
            	if(that.transitionFinished === false)	return false;
	        	if(that.animateFinished === false) return false;
	        	if(that.options.slideShow !== false) clearInterval(that.slideShowSpeed);
				if(that.isTouch !== true && !that.wrapper.hasClass('grabbing')) that.wrapper.addClass('grabbing');				

				var e = e.originalEvent || e;

				that.x = 0;
				that.relX = 0;

				$(this).css(that.removeTransition());

				var position = $(this).position();
				settings.relativePos = position.left;
            	settings.offsetX = getTouches(e).x - position.left;
            	settings.offsetY = getTouches(e).y - position.top;

	        	toggleEvents('on');
	        	settings.sliding = false;
			}

			var dragEnd = function(){

				if(that.isTouch !== true) that.wrapper.removeClass("grabbing");

            	toggleEvents('off');

            	if(that.x !== 0){
            		var position = that.getPosition();
            		that.jump(position);
            		that.wrapper.on('click.ndrslider3','a',disableClick);
            		/* ZPIX ausloesen */
            		countPixel("jsndrGallery");
            	} else if(that.isTouch === true) that.wrapper.off('click.ndrslider3');
			}
			
			function dragMove(e){

				var event = e.originalEvent || event;

        		that.x = getTouches(event).x- settings.offsetX;
        		that.posY = getTouches(event).y - settings.offsetY;
        		that.relX = that.x - settings.relativePos;

            	if(that.relX > 4 || that.relX < -4 && that.isTouch === true){

            		e.preventDefault ? e.preventDefault() : e.returnValue = false;
                	settings.sliding = true;
           		}

           		if((that.posY > 32 || that.posY < -32) && settings.sliding === false) $(document).off("touchmove.ndrslider3");

            	var minSwipe = function() { return  that.relX / 32; }
            	var maxSwipe = function() { return  that.maximumPixels + that.relX / 32; }
            	
            	that.x = Math.max(Math.min( that.x, minSwipe() ), maxSwipe() );
                if(window.css3dSupport === true) that.transition(that.x);
                else that.staticPosition(that.x);
			}



			that.$elem.on(that.event['start'], ".wrapper", dragStart); 

		},

		getPosition : function(){
			
			var that = this;
			var position = that.calcSlide();

	    	if(position>that.maximumSlide){
	    		
	    		that.currentSlide = that.maximumSlide;
	    		position  = that.maximumSlide;
	    	} else if( that.x >=0 ){
	    		
	    		position = 0;
	    		that.currentSlide = 0;
	    	}
	    	return position;
		},
		
		getDirection : function(){
			
			var that = this;
			var direction;
			
			if(that.relX < 0 ){ direction = "right"; that.playDirection = "next";
			} else { direction = "left"; that.playDirection = "prev"; }
			return direction;
		},
		
		hoverStop : function(){
			
			var that = this;
			if(that.isTouch === false && that.options.slideShow !== false && that.options.hoverStop === true) {
				
				that.$elem.on('mouseover', function(){ that.stop(); });
				that.$elem.on('mouseout', function(){ if(that.hoverStatus !== "stop"){ that.play(); } });
			}
		},
		
		calcSlide : function(){
			
			var that = this;
			var positions = that.positionsInArray;
			var x = that.x;
			var closest = null;
			
			$.each(positions, function(i,v){
				
				if( x - (that.itemWidth/8) > positions[i+1] && x - (that.itemWidth/8)< v && that.getDirection() === "left") {
					
					closest = v;
					that.currentSlide = i;
				}  else if (x + (that.itemWidth/8) < v && x + (that.itemWidth/8) > positions[i+1] && that.getDirection() === "right") {
					
					closest = positions[i+1];
					that.currentSlide = i+1;
				}
			});
			
			return that.currentSlide;
		},

		clearEvents : function(){
			
			var that = this;
			that.$elem.off('.ndrslider3');
			$(document).off('.ndrslider3');
		},

		addEvents : function(){
			
			var that = this;
			
			that.addElementClickEvents();
			
			that.$elem.on('ndrslider3.play',function(){ that.play(); that.hoverStatus = "play"; });
			that.$elem.on('ndrslider3.stop',function(){ that.stop(); that.hoverStatus = "stop"; });
			that.$elem.on('ndrslider3.next',function(){ that.next(); });
			that.$elem.on('ndrslider3.prev',function(){ that.prev(); });
		},
		
		addElementClickEvents : function() {
			
			var that= this;
			
			if(that.options.elementClickable===true) {
				that.userItems.on('click', function(e) {
						that.options.slideShow=false;
						that.jump($(this).data('item'), false, true);
						/* ZPIX ausloesen */
						countPixel("jsndrGallery");
						return false;						
				});
			}			
		},
		
		removeEvents : function(){
			
			var that = this;
			
			that.removeElementClickEvents();
			
			that.$elem.off('ndrslider3.play');
			that.$elem.off('ndrslider3.stop');
			that.$elem.off('ndrslider3.next');
			that.$elem.off('ndrslider3.prev');
		},
		
		removeElementClickEvents : function() {
			
			var that= this;

			that.userItems.off('click');
		}
	};	
})( jQuery, window, document );