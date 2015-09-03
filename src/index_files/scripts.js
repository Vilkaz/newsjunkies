

;_logLevel = 99;
if (typeof console === "undefined" || typeof console.log === "undefined") { console = {}; console.log = function() {}; }
if (typeof log === "undefined") log = function(msg,type) { 
	if (typeof type === "undefined" || typeof type === "undefined") type=4; if (_logLevel>=type) console.log(msg);
};

var isOldIE = document.all && !document.getElementsByClassName; // IE<9

$(document).ready(function() {
			
	checkCss3dSupport();
	$(this).responsiveImages();
	
	// NDR Kommentarsystem
	$('.soforumContainer').ndrSoforum();
	
	$(".teaser, .searchresult li").each(function() {
		var url = $(this).find("h2 a").attr("href");
		var link = $(this).find("h2 a");
		if(url) {
			$(this)
			.find("img,p,.subline,.cta").css({"cursor":"pointer"}).on("click", function(e){
				e.preventDefault();
				if(link.hasClass("forcepopup")) {
					link.trigger("click");
				} else {
					if(link.attr("target") == "_blank" ) { 
						window.open(url,"blank");
					} else {
						document.location.href=url;
					}
				} 
			})
		}
	})
		
	/* Teasershow fuer Regionalschlagzeilen */
		
	if($("div.shortnews").length > 0) {			

		$(".shortnews").bind("click",function(e) {
			e.stopPropagation();
		}).find('p').each( function () {
			$(this).height($(this).height());
		});
		
		$(".teasershow").accordion({
    		heightStyle: "auto"
		});
		var tst = window.setInterval("teasershow()", 6000);
		
		$("div.shortnews").mouseenter(function() {
			window.clearInterval(tst);
		})	
		/**/
	}
	
	/* Live-Hoeren-Button fuer Radio Startseite */
	$(".listenlive").on("click",function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		var w = $(window).width() > 720 ? 720 : $(window).width();
		var h = $(window).height() > 700 ? 700 : $(window).height();
		var player = window.open(url,"player","width="+w+",height="+h+",top=100,left=100,scrollbars=no,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes");
		player.focus();

	})
	
	buttonShine();
	
	init_slider_slideshow();

	
	$(".jq-ui-accordion").accordion();
	
	/* Tabls mit optionaler active-Vorbelegung */
	$(".jq-ui-tabs").each(function() {
		var act = $(this).find("li a.active").parent().index() >= 0 ? $(this).find("li a.active").parent().index() : 0;
		$(this).tabs({ 
			active : act,
			activate : function(event) { countPixel("jsTabbox") }
		});
	})
	
	$(".zoomimage").magnificPopup({
		type:'image',
		tClose: 'Schlie&szlig;en (ESC)',
		callbacks: {
			open: function() {
				countPixel("jsLargeImageVersion");
			}
		}	
	});
	
	$(".bildershow").magnificPopup({
		tLoading: 'Bild wird geladen...',
		tClose: 'Schlie&szlig;en (ESC)',
		delegate: 'a',
		type: 'image',
		gallery: {
			enabled: true,
			navigateByImageClick: true,
		    tPrev: 'Zur&uuml;ck (Pfeiltaste links)',
		    tNext: 'Weiter (Pfeiltaste rechts)',
			tCounter: '%curr% von %total%'
		},
		image: {
		    tError: 'Bild konnte nicht geladen werden.'
		},
		callbacks: {
			open: function() {
				countPixel("jsBildershow");
			},
			imageLoadComplete: function() {
				document.location.hash=this.currItem.index;
				updateBildershowSocial();
				countPixel("jsBildershow");
			},
		    buildControls: function() { 
		        this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
		    }
		}
	});
	
	if($(".bildershow").length > 0 && document.location.hash != "") {
		var i = document.location.hash.slice(1);
		if(i > 0) {
			$(".bildershow a:eq("+i+")").trigger("click");		
		}		
	}
		
	if($("#searchform").length > 0) {
		initSearchform();
	}

	$("#skiplink").on("click",function(){
		
		if($(".topteaser").length > 0) {
			$(".topteaser h2:first").attr("tabindex","0").focus();
		}	else {
			$("h1:first").attr("tabindex","0").focus();
		}
		
	})
	
	init_navigation();
	init_forms();
	
	updateSharebox();
	activatePodcastbuttons();
	init_mediathek();
	init_epg();
	init_osm();
	init_weather_short();
	init_beforeafterslider();

	if($(".oac").length > 0 || $(".radiostartseite").length > 0) {
		init_oac();
	}
	
	if($(".calendar, .kk_kalender").length > 0) {
		$.cachedScript("/resources/js/kk_kalender.js");
	}
	
	if($("#ecards").length > 0) {
		$.cachedScript("/resources/js/ecards.js");
	}
	
	if($(".quizstarter, .quiz, .quizwrap").length > 0) {
		$("head").append('<link type="text/css" rel="stylesheet" href="/resources/css/generated/quizvoting.css" media="all">');
		$.cachedScript("/resources/js/quiz.js");
	}
	
	if($(".vote").length > 0) {
		$("head").append('<link type="text/css" rel="stylesheet" href="/resources/css/generated/quizvoting.css" media="all">');
		$.cachedScript("/resources/js/voting.js");
	}
	
	if($(".tablestarselect").length > 0) {
		$.cachedScript("/resources/js/tablestarselectors.js");
		$('.pagepadding').css({'overflow':'hidden'}); 
	}
	
	if($(".rwdtable").length > 0) {
		$.cachedScript("/resources/js/rwd_tables.js");
	}
	
	if($(".webcam").length > 0) {
		$.cachedScript("/resources/js/webcam.js");
	}
	
	if($(".wetter").length > 0) {
		$.cachedScript("/resources/js/wetter.js");
	}
	
	if($(".chronologie").length > 0) {
		$.cachedScript("/resources/js/chronologie.js");
	}
	
	if($(".pagedbox").length > 0) {
		$.cachedScript("/resources/js/pagedbox.js");
	}
	
	if($(".topn").length > 0) {
		$.cachedScript("/resources/js/topn.js");
		$.cachedScript("/resources/js/swfobject.js");
	}
	
	if($(".countdownbox").length > 0) {
		$.cachedScript("/resources/js/jquery.countdown.js");
	}
	
	$(".showcopyrights").on("click", function(e) {
		e.preventDefault();
		showcopyrights();
	})
	
	/* harte Umbrueche bei Mosaikteasern entfernen - ermoeglicht flexibleren Seitenaufbau */ 
	$(".mosaik").parent().find(".clearme").remove()
	
	$("#printbox").prependTo(".pagepadding .modulepadding:first");
	
	/* Helfer fuers Ausdrucken von Rezepten: mittels print-nobox wird im Druckstylesheet die Boxenspalte unterdrueckt */
	if($("#rezepte").length == 1) { $("body").addClass("print-nobox") }
	if($("form[name='vtx']").length == 1) { $("body").addClass("print-nobox") }
	
	$(".printlink").css("display","block").on("click", function(e){ 
			e.preventDefault(); 			 
			window.print(); 	
	});
	
	$('.teaser .teasertext .subline').each(function(id,element) {
		
		/* Dirty Fix für Teaser bei denen im Überschreibcontainer die Uhrzeit unterdrückt wird */
		if($(element).html()=='Uhr') $(element).css({'display':'none'});
	});

	/* Popup-Funktionen */
	/* Ausgewaehlte Links werden mit der klasse forcepopup markiert und mit data-Attributen fuer die dimensionen versehen */
	
	$("a[href*='wahl.tagesschau.de/monitor']").addClass("forcepopup").data("width","728").data("height","566");
	$("a[href*='http://wahlarchiv.tagesschau.de/']").addClass("forcepopup").data("width","728").data("height","566");
	$("a[href*='http://spielerzeugnis.ndr.de/']").addClass("forcepopup").data("width","1000").data("height","600");
	
	/* Die eigentliche Popup-Funktion fuer alle markierten Links */
	
	$("a.forcepopup").on("click", function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		var w = parseInt($(this).data("width"));
		var h = parseInt($(this).data("height"));
		
		ndrpopup = window.open(url,"popupwindow", 'width='+w+', height='+h+',left='+((screen.width- w )/2)+',top='+((screen.height-h)/2)+', resizable=1, scrollbars=yes, menubar=0, location=0');
		ndrpopup.focus();
		
	});
	
	/* folgende Zeile fixed einen Bug in Safari mobile, der keine Klickevents auf Label-Elementen registriert */
	if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ) {
		// $('label').on("touchend", function(e) { $(this).find("input").trigger("click"); });
	}
		
	$(".tsbox .boxhead").css("cursor","pointer").on("click", function() {
		document.location.href = "http://www.tagesschau.de";
	});
	
	/* U-Vote Snippets  */
	$('.brdm-det-resgesamt').each(function() {
		
		if($(this).closest('.chart-loader').length==0) {
			
			/* Nun denn: wir greifen uns alle h2 innerhalb der Snippets */
			$(this).find("h2").each(function() {
				/* ... ersetzen "- Wahlgewinner" durch nichts */	
				var hl = $(this).text().replace(/- Wahlgewinner/,"");
				/* und setzen das Ergebnis wieder als text in die headline ein. */
				$(this).text(hl);
			});
			/* Dafuer kommt niemand in den Programmiererhimmel */
			
			
			$(this).children('[data-timequality!="actual"]').css({'display':'none'});			
			$(this).children('[data-resultkey="KW-Stichwahl-2014"]').css({'display':'none'});		
			$(this).children('[data-resultkey="KW-Amtsinhaber"]').css({'display':'none'});
			$(this).children('h2[data-resultkey="KW-Person-2014"]').css({'display':'none'});
			$(this).children('.moreInfo').css({'display':'none'});
			$(this).children('p.resulttime').css({'display':'none'});
			$(this).children('div.trenner').css({'display':'none'});
			
		}
	});
	
	// Livecenter
	if($(".livecenter").length > 0) {
		
		yepnope({
			load: [ "/common/resources/lib/jq_plugins/jquery.livecenter.js", 
			        "/resources/js/notificationfx.js",
			        "/resources/css/notificationfx.css",
			        "/resources/js/footable.min.js",
			        "/resources/js/footable.paginate.min.js",
			        "/resources/css/footable.core.css"
			      ],
			complete : function() { init_livecenter(); }
		});		
	}	
	
	if($(".frameresizer").length > 0) {
		
		yepnope({
			load: [ "/common/resources/lib/js/iframeResizer.min.js"
			      ],
			complete : function() { iFrameResize(); }
		});		
	}	
	
	
	$('.brdm-det-resgesamt:eq(0)').find('h2[data-resultkey="KW-Person-2014"]').css({'display':'block'}); //finde die h2 der ersten Tabelle und zeige sie
	
		$('header').siblings('h1').css({'display':'none'}); //Mit dem Befehl erwische ich nur das erste Snippet
		$('.pageContainer h1').css({'display':'none'});	//Es geht um die Wahlergebnissdetailsseiten. Dort darf nur die erste h1 ausgespielt werden. Leider habe ich keine Wrapper-Class	
	
	
	if($(".copytext p").length > 0 && $(".externalapp").length == 0) {
		/* est. reading time */
			
		var txt = ""; 
		$(".copytext p, .copytext td").not(".caption, .inpagecomments p").each(function() {
			txt += $(this).text();
		}); var words = txt.split(" ");
		
		$(".lastchanged").append(" - Lesezeit: ca." + Math.ceil(words.length / 200) + " Min.");
	}
	
	/* ZPIX-Service fuer flypsite. Falls ein FS-iframe vorhanden ist, uerbergeben wir die gloable ZPIX-Variable fuer die Zaehlung innerhlab FS */
	
	if($("iframe").length > 0 && $("iframe").attr("src").match("flyp.tv") != null) {
		var flypurl = $("iframe").attr("src");
		$("iframe").attr("src", flypurl + "#" + ZPIX);	
	}
	
	/* hilfskonstruktion fuer alte Dachmarkenlogos */
	if($("#dachmarkenlogo img").length > 0 ) {
		if($("#dachmarkenlogo img").attr("src").match("logosprite") != null) {
			$("#dachmarkenlogo").attr("id","dachmarkenlogo_old");		
		}
	}
	
	/* Reload-Button fuer Liveberichterstattung */
	
	$(".reloader .button").attr("href", document.location.href);
	
	/* Branding fuer Storytelling */
	if($(".viewport").length > 0) {
		$("body").addClass($(".viewport").data("branding"));
	}
	
}); // ENDE JQUERY READY

/* Functions to be run onLoad - required, if images are supposed to be present for exact height/width-calculations */

window.onload = function() {

	if($(".tv_hp_epgteaser").length>0) $(".tv_hp_epgteaser, .tvlive").equalize();
	$(".mt_audiostage .radiologobox .textpadding").equalize();
	columnize($(".columnedlist .column"));
	
	
}


//manipuation der resize-function 
if(!isOldIE) {
	$(window).resize(function () {
	    waitForFinalEvent(function(){
	       /* HIER KOMMEN ALLE FUNKTIONSAUFRUFE REIN, DIE NACH EINEM RESIZE BENOETIGT WERDEN. 
		   FUER DIE UEBERSICHT AM BESTEN NUR DEN AUFRUF, NICHT DIE GANZEN FUNKTIONEN SELBST ;) */
	    
	    	
	    	$(".pagedbox").each(function() { $(this).pagedbox() });   	
	    	
	    	$.responsiveImages.m.resize($.responsiveImages.cfg.containerSelector);
	    	
	    	if($(".tv_hp_epgteaser").length>0) $(".tv_hp_epgteaser, .tvlive").equalize();
	    	$(".mediathekstage .mplayer_textcontent, .mediathekstage .tvlive").equalize();
	    	
	    	if($(".livecenter").length > 0) {
	    		var width = parseFloat($('.ticker_livecenter').css('width'))/parseFloat($('.ticker_livecenter').parent().css('width'));
	    		if(width!=parseFloat($('.ticker_livecenter').data('width'))) {
	    	   		if(width==1) { 
	    	   			if($('.module.blitztabelle.w33').length>0)	{
	    	   				$('.module.blitztabelle.w33').after($('#scribblewrapper'));
	    	   			} else if($('.ticker_livecenter').length>0)	{ 
	    	   				$('.ticker_livecenter').after($('#scribblewrapper'));
	    	   			}
	    	   		} else if($('.program_livecenter').length>0) {
	    	   			$('.program_livecenter').after($('#scribblewrapper'));
	    	   		}
	    			$('.ticker_livecenter').data('width',width);
	    		}
	    	}
	    	
	    }, 200, "1234567890");
	});
}
	
// verzoegert die resize-functionen auf NACH resizen 
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {uniqueId = "Don't call this twice without a uniqueId";}
    if (timers[uniqueId]) {clearTimeout (timers[uniqueId]);}
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

/* Alle Buttons sollen eine helle Glanzkante oben haben. Per JS hinzugefuegt, um das HTML einfach/semantisch zu halten */
function buttonShine(selector) {
	
	$(".button").each(function() {
		if ($(this).css("position") != "absolute" && $(this).css("position") != "relative" && $(this).is(".quizstarter .button, .detailview .button, #btt") == false) {
				$(this).css("position","relative")
		}
		
		if($(this).find(".buttonshine").length == 0) {
			$(this).prepend("<span class='buttonshine'></span>");
		}
	})
}
function slideshowpreload(el) {
	var myindex = el.index();
	var nextel = el.next();
	if(myindex == 1) {
		var num = el.parent().find("li").length - 2;
		var prevel = el.parent("ul").find("li:eq("+ num +")");
		
	} else {
		var prevel = el.prev();
	}

	var currsrc 	= el.find("img").attr("src");
	var currlarge	= el.find("img").attr("data-large");
	var nextelsrc 	= nextel.find("img").attr("src");
	var nextellarge = nextel.find("img").attr("data-large");
	var prevelsrc 	= prevel.find("img").attr("src");
	var prevellarge = prevel.find("img").attr("data-large");
	
	if(nextelsrc != nextellarge) {
		nextel.find("img").attr("src", nextel.find("img").attr("data-large"));
	}
	if (prevelsrc != prevellarge) {
		prevel.find("img").attr("src", prevel.find("img").attr("data-large"));
	}
}

function teasershow() {
	
		$(".shortnews .jq-ui-accordion").each(function() {
			var nextheader = $(this).find("h2.ui-state-active").nextAll("h2:first");
				if (nextheader.length > 0 ) {
					nextheader.trigger("click");					
					// $(this).accordion("activate", nextheader);
				} else {
					$(this).accordion("option","active", 0);
				}
		})
	}


function equalheight(elements) {
	var targetheight = 0;
	log("height: " +targetheight);
	
	$(elements).each(function() {
		if($(this).outerHeight() > targetheight) {
			targetheight = $(this).outerHeight();
		}
	})
	
	$(elements).css({
			"box-sizing": "border-box",
			"height"	: targetheight
	});
}

function columnize(obj) {
	if(!$.browser.msie || $.browser.version >= 10) { obj.css("width","100%");return; }
	var totalheight = obj.height();
	if(obj.hasClass("w25")) {
		var columncount = 4;
	} else if (obj.hasClass("w33")) {
		var columncount = 3;
	} else if (obj.hasClass("w50")) {
		var columncount = 2;
	} else {
		return;
	}
	
	var targetheight = totalheight / columncount - 5 ;
	
	var cache = obj.find("> *");
	
	obj.empty();
	
	var count = 0;
	
	for( i = 0; i < columncount; i++ ) { 	
		var thiscolumn = obj.clone().insertBefore(obj);

		while(thiscolumn.find("> *").length < cache.length/columncount && count < cache.length) {
		thiscolumn.append(cache[count]);
		count = count + 1;
		}

	}		
}

function init_livecenter_old() {

	var width = parseFloat($('.ticker_livecenter').css('width'))/parseFloat($('.ticker_livecenter').parent().css('width'));
	if(width!=parseFloat($('.ticker_livecenter').data('width'))) {
   		if(width==1) {
   			if($('.module.blitztabelle.w33').length>0)	$('.module.blitztabelle.w33').after($('#scribblewrapper'));
   			else if($('.ticker_livecenter').length>0)	$('.ticker_livecenter').after($('#scribblewrapper'));
   		}
		$('.ticker_livecenter').data('width',width);
	}

	
	
	
	$('.livecenter .blitztabelle .footable').footable({
		breakpoints : {
			xs : 240,
			s : 290
		}
	});
	
	$(this).ndrSportLivecenter();	
	
	var livestreamCount = 0;
	$('.livecenter .projekktor_livecenter').each(function() {
		
		livestreamCount++;
		if ($(this).parent().has('[data-streamtype]')) {
			
			var $livestreamContainer=$(this).parent();
			$('.livecenter .videolinks a[data-streamtype="'+$livestreamContainer.attr('data-streamtype')+'"]').on('click', function() {

				countPixel('sportlivecenter_'+$livestreamContainer.attr('data-streamtype'));
				
				
				if($livestreamContainer.attr('data-streamtype')==='video') var currentStreamType='audio';
				else var currentStreamType='video';
				
				var currentPlayerId=$('.livecenter .projekktor_livecenter_').closest('div[data-streamtype="'+currentStreamType+'"]').find('.projekktor').attr('id');	
				if(typeof currentPlayerId!='undefined') projekktor('#'+currentPlayerId).setPause();				
				
				$('.livecenter .projekktor_livecenter').parent().hide();
				$('.livecenter .videolinks a[data-streamtype]').removeClass('active');
				$('.livecenter .videolinks a[data-branding="'+$livestreamContainer.attr('data-branding')+'"]').addClass('active');			
				$('.livecenter .logobox[data-streamtype]').hide();
				$('.livecenter .logobox[data-branding="'+$livestreamContainer.attr('data-branding')+'"]').show();		
				$livestreamContainer.show();

				var playerId=$('.livecenter .projekktor_livecenter').closest('div[data-streamtype="'+$livestreamContainer.attr('data-streamtype')+'"]').find('.projekktor').attr('id');	
				
				if(typeof playerId!='undefined') {
					projekktor('#'+playerId).setSize();				
					projekktor('#'+playerId).setPlay();						
				}			
			});
		} 
	});
	
	if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').length>0) {
		
		$('.livecenter .videolinks a[data-streamtype="video"]').addClass('active');
		$('.livecenter .logobox[data-streamtype="video"]').show();	
		
		if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').length>0) {
			
			$('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').hide();
		} else {
			
			$('.livecenter .videolinks a[data-streamtype="video"]').off('click');
		}
	} else if($('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').length>0) {
		
		$('.livecenter .videolinks a[data-streamtype="audio"]').addClass('active');
		$('.livecenter .logobox[data-branding="'+$('.livecenter .videolinks a[data-streamtype="audio"]').attr('data-branding')+'"]').show();		
		if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').length>0)  { 
			$('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').hide();
		} else {
			
			$('.livecenter .videolinks a[data-streamtype="audio"]').off('click');
		}
	}
}


function init_livecenter() {

	var width = parseFloat($('.ticker_livecenter').css('width'))/parseFloat($('.ticker_livecenter').parent().css('width'));
	if(width!=parseFloat($('.ticker_livecenter').data('width'))) {
   		if(width==1) {
   			if($('.module.blitztabelle.w33').length>0)	$('.module.blitztabelle.w33').after($('#scribblewrapper'));
   			else if($('.ticker_livecenter').length>0)	$('.ticker_livecenter').after($('#scribblewrapper'));
   		}
		$('.ticker_livecenter').data('width',width);
	}

	
	
	
	$('.livecenter .blitztabelle .footable').footable({
		breakpoints : {
			xs : 240,
			s : 290
		}
	});
	
	$(this).ndrSportLivecenter();	
	
	var livestreamCount = 0;
	$('.livecenter .projekktor_livecenter').each(function() {
		
		livestreamCount++; 
		if ($(this).parent().has('[data-streamtype]')) {
			
			var $livestreamContainer=$(this).parent();
			$('.livecenter .videolinks a[data-streamtype="'+$livestreamContainer.attr('data-streamtype')+'"]').on('click', function() {

				countPixel('sportlivecenter_' + $(this).attr('data-streamtype'));
				
				
				var currentBranding = $(this).attr('data-branding');
				
				var currentPlayerId=$('.livecenter .projekktor_livecenter_').closest('div[data-branding="'+currentBranding+'"]').find('.projekktor').attr('id');	
				if(typeof currentPlayerId!='undefined') projekktor('#'+currentPlayerId).setPause();				
				
				$('.livecenter .projekktor_livecenter').parent().hide();
				$('.livecenter .videolinks a[data-streamtype]').removeClass('active');
				$('.livecenter .videolinks a[data-branding="'+currentBranding+'"]').addClass('active');			
				$('.livecenter .logobox[data-streamtype]').hide(); 
				$('.livecenter .logobox[data-branding="'+currentBranding+'"]').show();		
				$('.livecenter .projekktor_livecenter').closest('div[data-branding="'+currentBranding+'"]').show(); 

				var playerId=$('.livecenter .projekktor_livece nter').closest('div[data-branding="'+currentBranding+'"]').find('.projekktor').attr('id');	
				
				if(typeof playerId!='undefined') {
					projekktor('#'+playerId).setSize();				
					projekktor('#'+playerId).setPlay();						
				}			
			});
		} 
	});
	
	if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').length>0) {
		
		$('.livecenter .videolinks a[data-streamtype="video"]').eq(0).addClass('active');
		$('.livecenter .logobox[data-streamtype="video"]').eq(0).show();	
		
		if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').length>0) {
			
			$('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').hide();
		} else {
			
			$('.livecenter .videolinks a[data-streamtype="video"]').off('click');
		}
	} else if($('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').length>0) {
		
		$('.livecenter .videolinks a[data-streamtype="audio"]').eq(0).addClass('active');
		$('.livecenter .logobox[data-branding="'+$('.livecenter .videolinks a[data-streamtype="audio"]').attr('data-branding')+'"]').show();		
		if ($('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').length>0)  { 
			$('.livecenter .projekktor_livecenter').parent('[data-streamtype="video"]').hide();
		}
		
		$('.livecenter .projekktor_livecenter').parent('[data-streamtype="audio"]').not(':eq(0)').hide();

	}
}

function init_osm() {
	
	if(/* maps || */ $("#traffic_map").length > 0) {
		yepnope({
			load: [ "/resources/js/osm.js", "/resources/css/generated/osm.css" ],
			complete : function() { init_traffic(); }
		});		
	}
	
	if(/* maps || */ $("#a7ausbau_map").length > 0) {
		yepnope({
			load: [ "/resources/js/osm.js", "/resources/css/generated/osm.css", "/resources/js/a7ausbau.js" ],
			complete : function() { init_a7ausbau(); }
		});		
	}
}

function init_mediathek() {

	if($(".mediathekstage").length>0) {

		var stage = $('.mediathekstage');
		
		stage.imagesLoaded(function( $images, $proper, $broken ) { 
			$.each(stage.find('.mediathekstageteaser'), function(id,el) {
				
				var html = $(el).find('.runtime').html();
				html = html.replace('min', '');
				$(el).find('.runtime').html(html);
			});
			
			stage.find(".mplayer_textcontent, .tvlive").equalize();
			stage.find('.projekktor').css('background','#000');
		});	
	}
}

function init_slider_slideshow() {
	
	if($(".mt_slider").length>0 || $(".stage_slider").length>0 || $(".ndrgallery").length>0) {
		
		/* provisorische Loesung fuer Audio-Teaser ohne Bild in Slidern. Wenn kein Bild, mal ich mir halt selber eins. */
		$(".mt_slider .teaser").each(function() {
			if($(this).find(".teaserimage").length == 0) {
				$(this).prepend('<div class="teaserimage"><div class="image-container" style="background-color: #1d5596"><img src="/common/resources/images/mediathek/default-audio-image.png" alt="kein Bild vorhanden" /></div><div class="overlay"><div class="textpadding"><span class="icon icon_audio"></span></div></div></div>')
			}		
		})
		
		/* schmutziges provisorium zur Kennzeichnung der Live-Sendung. */
		$(".stage_slider .progressbar").parents(".module").find("h1").prepend('<span class="icon icon_jetzt"></span> ');
			
		yepnope({
			load: [ "/resources/js/jquery.ndrslider3.js", "/resources/css/generated/ndrslider3.css" ],
			complete : function() { 
				$(".mt_slider").ndrSlider3();
				$(".stage_slider").ndrSlider3();
				$(".ndrgallery").ndrSlider3();
				
				if($(".ndrgallerystage").length>0) $(".ndrgallerystage").ndrSlider3('updateData');
				if($.browser.msie && $.browser.version < 10) {
					$(".icon_arrow_right, .icon_arrow_left").each(function() {
						$(this).clone().insertBefore($(this)).css({"position":"relative","right":"-1px","color":"#999"});				
					});
				}
			}
		});		
	}	
}

function init_beforeafterslider() {	
	if($(".twentytwenty-container").length > 0) {
		yepnope({
			load: ["/resources/css/generated/beforeafterslider.css","/resources/js/beforeafterslider.js"],
			complete: function() {
				$(".twentytwenty-container").twentytwenty();
			}
		});
	}
}

function init_epg() {

	/* Make thumbnails clickable  */	
	$("#program_schedule li.program .thumbnail").each(function() {
		var link= $(this).next(".details").find("h3 a").attr("href");
		var title=$(this).next(".details").find("h3 a").attr("title");
		if(link != undefined) {
		$(this).on("click",function() {
				document.location.href = link
			}).css({
				"cursor": "pointer"
			}).attr("title",title)
		}
		
	});

	
	/* activate scrolling anchorlinks (nowlive, goto timeslot, etc) */	
	$(".timeanchors a").on("click", function(e) {
		if($(this).attr("href").match(/.#jumpto_now/) != null) {
			/* wenn der "Jetzt"-Link mit mehr als nur dem anchor gefuellt ist, aussteilgen und dem Link folgen, denn "jetzt" ist an einem anderen Tag... poetik der epg-programmierung */
			return;
		}
		e.preventDefault();	
		$(".timeanchors a").removeClass("active");
		var btn = $(this);
		// var target = "."+$(this).data("rel");
		var target = $(this).attr("href");
		$.scrollTo(target, {
			duration: 500,
			offset: {
				top: -150
			},
			onAfter:  function() {
				btn.delay(100).addClass("active");
				}
		});
	})
	
	/* make datenavigation sticky */
	var fixpos = 0;

	$(document).scroll(function() {
		
		var diff = Math.abs($(window).scrollTop() - fixpos);
	  	if(diff > 100){
	    	$(".timeanchors a").delay(50).removeClass("active");
	    	fixpos = $(window).scrollTop();
	  	}
	
		if(window.pageYOffset > 120) {
			$(".mt_datenav").css({
				"position": "fixed",
				"top": 0,
				"width": "100%",
				"max-width": "60em",
				"z-index": 100
			})
		} else {
			$(".mt_datenav").css({
				"position": "relative"
			})
		}
	})
	
	/* init slidetoggle for partials (show/hide beitraege and detailinfo) */
	$(".partials").slideUp(0);
	$(".partialswitch").css("cursor","pointer").on("click", function(e) {
		e.preventDefault();
		if($(this).next(".partials").length > 0) {
			$(this).find(".icon").toggleClass("icon_arrow_down").toggleClass("icon_arrow_up");
			$(this).next(".partials").slideToggle();	
		} else if ($(this).parents(".mplayer_textcontent").length > 0) {
			$(this).find(".icon").toggleClass("icon_arrow_down").toggleClass("icon_arrow_up");
			$(this).parents(".mplayer_textcontent").find(".partials").slideToggle();
		}
	})
	
	/* activate datepicker and generate parametrized link */
	$(".mt_datenav .form_element, .mt_prgnav fieldset").css("dispaly","block");
	$("#prgselect input[type='submit']").hide();
	
	$("#selectdate").datepicker({
		dateFormat: "yy-mm-dd"
	});
	
	if($("#displayfilter, #selectdate").length != 0) {
		var loader = new Image();
		loader.src = "/resources/images/fancybox/fancybox_loading@2x.gif";
	}
	
	var myurl = document.location.href;
	
	$("#displayfilter, #selectdate").on("change", function() { 
		var mydate = $("#selectdate").val() != "" ? $("#selectdate").val() : myurl.replace(/.*_date-(\d\d\d\d-\d\d-\d\d).*/,"$1");
		var mysophoraid = $("#selectdate").data("rel");
		
		var mytgturl = "//" + document.location.host +  mysophoraid + "_date-" + mydate + ".html";
		showloader();
		document.location.href = mytgturl;

	});		
}

function showloader() {
	$("body").append('<div class="loadinganimation"><img src="/resources/images/fancybox/fancybox_loading@2x.gif" alt="Inhalt wird geladen" /></div>');
}

function activatePodcastbuttons() {
	
	$("#start_podcastabo").on("click", function(e) {
		e.preventDefault();
		$(this).toggleClass("active");
		$(".copyurlform").hide();
		$(".m_podcastabo").toggle();
		if($(".m_podcastabo").is(":visible")) {
			$(".itunes").focus();
		}		
	});
	
	$(".copyurl").on("click", function(e) {
		e.preventDefault();
		$(".copyurlform").toggle();
		if($(".copyurlform").is(":visible")) {
			$(".copyurlform input").focus().select();
		}
	});
	
	$(".closer").on("click", function(e) {
		e.preventDefault();
		$(".popuppanel").hide();
		$("#start_podcastabo").removeClass("active").focus();
	})
	
};



function initSearchform() {
	$("#searchword").focus();
	
	$("#filter input, #filter select")
		.attr("tabindex",-1)
		.on("focus", function() {
		$("#filter").removeClass("blurred");
	});

	if(urlparams()["search_mediathek"] == 1) {
		$("#check_mediathek").attr("checked","checked");
		$("#filter").removeClass("blurred");
		$("#filter legend a").html('Einfache Suche <span class="icon icon_arrow_up"></span>');
		$("#filter input, #filter select").attr("tabindex",0);
	} else if (urlparams()["search_epg"] == 1) {
		$("#check_epg").attr("checked","checked");
		$("#filter").removeClass("blurred");
		$("#filter legend a").html('Einfache Suche <span class="icon icon_arrow_up"></span>');
		$("#filter input, #filter select").attr("tabindex",0);	
	} else if (urlparams()["search_video_subtitles"] == 1) {
		$("#check_corporate").attr("checked","checked");
		$("#filter").removeClass("blurred");
		$("#filter legend a").html('Einfache Suche <span class="icon icon_arrow_up"></span>');
		$("#filter input, #filter select").attr("tabindex",0);		
	}
	
	$("#searchfilter input").on("change", function() {
		if ($(this).is(":checked")) {
			$(this).parents(".form_element").siblings().find("input").attr("checked",false);
		}
	});
	
	$("#openfilter").on("click",function() {
		if($("#filter").hasClass("blurred")) {
			$("#filter").removeClass("blurred");
			$("#filter legend a").html('Einfache Suche <span class="icon icon_arrow_up"></span>');
			$("#filter input, #filter select").attr("tabindex",0);
		} else {
			$("#filter").addClass("blurred");
			$("#filter legend a").html('Erweiterte Suche <span class="icon icon_arrow_down"></span>');
			$("#filter input, #filter select").attr("tabindex",-1);
		}
	});
}

function init_forms() {
	/* Formularfunktion aus alten Zeiten: vorbelegte Eingabefelder werden beim ersten Fokussieren geleert */
	/* Die Klasse form_focus ist derzeit nicht verwendet - fuer spaetere Zaubereien */
	var formularElements = ['input[type="text"]', 'input[type="password"]', 'textarea'];
	jQuery.each(formularElements, function()
	{
		var el = ''+this;
		$(el).on(" focus",function() {
			$(this).addClass('form_focus');
	        /**
			* Input Felder mit der Klasse grey_box oder dont_delete_on_click werden nicht geleert.
			**/
			if( !$(this).hasClass("dont_delete_on_click")) {
				this.value = '';
				$(this).addClass('dont_delete_on_click');
			}
		}).on("blur", function() {
			$(this).removeClass('form_focus');
		});
	});
}

function init_oac() {
	
	$("#stationselect a, #titlesearch a, #titlesearch input, #titlesearch select").attr("tabindex",-1);
	$("#time").attr("disabled",true);
	
	$(".stationswitch").on("click", function(e) {
		e.preventDefault();
		if($("#stationselect").hasClass("off")) {
			$("#titlesearch").addClass("off");
			$("#stationselect, .pagecover").removeClass("off");	
			$("body a, body input").not("#stationselect a, .stationswitch").attr("tabindex",-1);
		} else {
			$("#stationselect, .pagecover").addClass("off");
			$("#stationselect a").attr("tabindex",-1);
			$("body a").not("#titlesearch *").attr("tabindex",0);
		}
	})
	

	
	$(".regioselectheader").on("click",function(e) {
		e.preventDefault();
		$(".regioselectlinks").slideToggle(250);
	})
	
	if($("#oactabs").data("url").match(/html/) ) {
		/* wenn ein Loopstream laeuft steht im data-Attribut eine url, die aufgerufen wird, denn der "live"-Tab benutzt wird oO */
		$("#ui-id-1").unbind().on("click", function(e) {
			e.stopPropagation();
			location.href = $("#oactabs").data("url")			
		})
	}
	
}

function updateSharebox(u) {
	var shareUrl = u ? encodeURIComponent(u) : encodeURIComponent(document.location);
	var shareTitle = encodeURIComponent(document.title.split("|")[0]);
	$(".to_facebook").attr("href", "http://de.facebook.com/sharer.php?u="+ shareUrl +"&t="+ shareTitle).attr("title","bei Facebook empfehlen").attr("aria-label","bei Facebook empfehlen");
	$(".to_twitter").attr("href","http://twitter.com/share?url=" + shareUrl + "&text=" + shareTitle).attr("title","bei Twitter empfehlen").attr("aria-label","bei Twitter empfehlen");
	if(navigator.userAgent.match(/(iPhone)/g) || navigator.userAgent.match(/Android\s([4-9\.]*)/i)) { 
		$(".to_google").attr("href", "WhatsApp://send?text="+shareUrl).attr("title","mit WhatsApp versenden").attr("aria-label","mit WhatsApp versenden").find(".icon").removeClass("icon_google").addClass("icon_whatsapp");
	} else {
		$(".to_google").attr("href","http://plus.google.com/share?url="+shareUrl).attr("title","bei Google Plus empfehlen").attr("aria-label","bei Google Plus empfehlen");
	}
}

function preventPopup() {
	clearTimeout(watimeout);
	watimeout = null;
	window.removeEventListener('pagehide',preventPopup);
}

function updateBildershowSocial() {
	if($(".mfp-title .button").length == 0 ) {
		$(".mfp-title").html('<a href="#" class="button iconbutton bsfb"><span class="icon icon_facebook"></span></a><a href="#" class="button iconbutton bstw"><span class="icon icon_twitter"></span></a>')
	}
	var shareUrl = encodeURIComponent(document.location);
	var shareTitle = encodeURIComponent($(".copytext h1").text());	
	$("a.bsfb").attr("href", "http://de.facebook.com/sharer.php?u="+ shareUrl +"&t="+ shareTitle);
	$("a.bstw").attr("href","http://twitter.com/share?url=" + shareUrl + "&text=" + shareTitle);
}

function init_weather_short() {
	$(".weather_short").each(function() {
		var numweather = $("li",this).length;
		var swc="";
		
		switch(numweather) {
			case 1:
				swc = "w100"; break;
			case 2:
				swc = "w50"; break;
			case 3:
				swc = "w33"; break;
			case 4:
				swc = "w25"; break;
			case 6:
				swc = "w33"; break;
			default:
				swc = "w25";
		}
		$("li",this).addClass(swc);
	})
}


function showcopyrights() {
	
	if($("#legal").length > 0) { $("#legal").slideUp(250, function() { $(this).remove() }); return; }

	/* Bildrechte/Fotografen anzeigen */
	$("#footer").append("<div id='legal'><ul></ul></div>")
	
	$("img").not("[src*='/resources/images/logos/'], [src*='/images/maps/'], [src*='virtualearth.net'], [src*='ivwbox'], [src*='clublogos.png']").each(function(){		
		/* Bilder mit der Klasse .nocopyright von der Anzeige ausschliessen */
		if($(this).closest(".nocopyright").length==0) {			
			var image = $(this).attr('src');
			var text = $(this).attr('alt');
			$("#legal ul").append("<li><img src='"+ image + "' alt='' />" + text +"</li>");			
		}
	});
	
	$.scrollTo("#legal",250);
	
}


(function($) {
	$.fn.equalize = function() {
		e = this;		
		var targetheight = 0;
		$(e).css({ "height"	: "auto" });				
		$(e).each(function() {
			if($(this).outerHeight() > targetheight) {
				targetheight = $(this).outerHeight();
			}
		})
		
		$(e).css({
				"box-sizing": "border-box",
				"height"	: targetheight
		});
		return e;
	}
	
})(jQuery);


/* Activate multiple Webcams on one Page and make them work independantly */


/* Projekktor Helper Functions */
function initProjekktor(player, playerId) {
	
	log('Init Projekktor Helper Functions for ',3);
	log(player,3);
	
    if (player.getConfig('isCrossDomain') ) $(".pplargesize, .pporgsize").hide();
	
	player.addListener('start', function(state, player) { 
		
		if (typeof eventProjekktorStateStarted==='function') eventProjekktorStateStarted('projekktor_'+playerId); 
	});
	
	player.addListener('state', function(state, player) { 
	
		if(state=='COMPLETED') { if (typeof eventProjekktorStateCompleted==='function') eventProjekktorStateCompleted('projekktor_'+playerId); } 
	});
	
	player.addListener('fullscreen', function(value) {
	
		switch (value) {
			case 	true	: if (typeof eventProjekktorEnterFullscreen==='function') eventProjekktorEnterFullscreen();
					break;
			case 	false	: if (typeof eventProjekktorExitFullscreen==='function') eventProjekktorExitFullscreen();
					break;
		}
	});
}
/*
function setProjekktorPosterImage(playerId) {
	
	log('Setting Projekktor Poster-Image',3);	
	
	selector='#projekktor_'+playerId;
	
	if($(selector).hasClass('projekktor')===true) {
		
		var imgSrc=projekktor('#projekktor_'+playerId).config.poster;
		if($(selector+'_poster').length==0) {
			
			$(selector).attr('style','background:none !important');
			$(selector).closest('.projekktor_holder').after('<div id="'+$(selector).attr('id')+'_poster" class="image-container"><img id="'+$(selector).attr('id')+'_poster_image" src="'+imgSrc+'" class="resize"></div>');	
		}

		$(selector+'_media_image').remove(); // remove original poster	
		
		var poster=$(selector+'_poster');
		poster.css({'position' : 'absolute', 'top' : '0', 'z-index' : '-1'});
		poster.imagesLoaded(function( $images, $proper, $broken ) { 
			
			// $(this).parent().find('.projekktor_holder').height($(this).find('img').height());
			$.responsiveImages.m.resizeViewport($(this)); 
		});	
	}	
} 
*/

function eventProjekktorStateStarted(id) {

	log('Video State started',3);	
	
	/* TO DO - hide related content */
	
	playerWidth=$('#'+id).width();	
	playerHeight=$('#'+id).height();	
	$('#'+id).parent().find('.relatedContent').css({'display':'none'});
	
}

function eventProjekktorStateCompleted(id) {
	
	log('Video State completed',3);	

	if (projekktor("#"+id).getInFullScreen()===true) projekktor("#"+id).setFullscreen(false);
	
	/* TO DO - show related content */
	
	playerWidth=$('#'+id).width();	
	playerHeight=$('#'+id).height();	
	playerControlHeight=$('#'+id).find('.ppcontrols').height()+22; 
	
	var related=$('#'+id).parent().find('.relatedContent');
	related.css({'width':playerWidth,'height':playerHeight-playerControlHeight,'display':'block'});
	related.find('.viewport').css({
									'margin-top':Math.round((playerHeight-playerControlHeight)/2),
									'top':(Math.round((related.find('.viewport').height()-8)/2)*-1),	// 8px Margin
									'margin-left':'50%',
									'left':(Math.round(((related.find('.viewport').find('.m_teaser').width()*related.find('.viewport').find('.m_teaser').length) + ((related.find('.viewport').find('.m_teaser').length-1)*8)   )/2)*-1)  // 8px Margin
								});
	
}

function eventProjekktorEnterFullscreen() {
	
	log('Video entered Fullscreen',3);
	
	$("#nav").css({ "z-index": -1 });
	$(".mediatheksbox, .boxhead, .shiny_line").css({ "display": "none" });
}

function eventProjekktorExitFullscreen() {
	
	log('Video left Fullscreen',3);
	
	$("#nav").css({ "z-index": 11 });
	$(".mediatheksbox, .boxhead, .shiny_line").css({ "display": "block" });
}
/* Ende Projekktor Helper Functions */


Array.prototype.move = function(from,to){
	this.splice(to,0,this.splice(from,1)[0]);
	return this;
};

if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {};
        F.prototype = obj;
        return new F();
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}


var checkCss3dSupport = function() {
	
    if (document.body && document.body.style.perspective !== undefined)  {
    	
    	window.css3dSupport=true;
    	return true;;
    }
    
    var _tempDiv = document.createElement("div"),
        style = _tempDiv.style,
        a = ["Webkit","Moz","O","Ms","ms"],
        i = a.length;
    
    
    if (_tempDiv.style.perspective !== undefined) {
    	window.css3dSupport=true;
    	return true;
    }
    while (--i > -1) { 
    	if (style[a[i] + "Perspective"] !== undefined)  {
    		
    		window.css3dSupport=true; 
    		return true;
    	}
    }
    
    window.css3dSupport=false;
};


var urlparams = function() {
	// returns urlparams as object (urlparams()[key] = value)
	var params = {}
	var werte = unescape(document.location.search);
	werte = werte.slice(1);
	var wp = werte.split("&");
	for (var i=0; i < wp.length; i++) {
		var name = wp[i].substring(0,wp[i].indexOf("="));
		var wert = wp[i].substring(wp[i].indexOf("=")+1, wp[i].length);
		params[name] = wert;
	}
return params;
}

var hashparams = function() {
	// returns urlparams as object (urlparams()[key] = value)
	var params = {}
	var werte = unescape(document.location.hash);
	werte = werte.slice(1);
	var wp = werte.split("&");
	for (var i=0; i < wp.length; i++) {
		var name = wp[i].substring(0,wp[i].indexOf("="));
		var wert = wp[i].substring(wp[i].indexOf("=")+1, wp[i].length);
		params[name] = wert;
	}
	return params;
}

var vendorPrefix = (function () {
	if (window.getComputedStyle) {	
		  var 	styles = window.getComputedStyle(document.documentElement, ''),
		    	pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']) )[1],
		    	dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		  
		  return {
		    dom: dom,
		    lowercase: pre,
		    css: '-' + pre + '-',
		    js: pre[0].toUpperCase() + pre.substr(1)
		  };
	}
	
	return {
	    dom: '',
	    lowercase: '',
	    css: '',
	    js: ''
	  };
})();

var checkCssAnimationSupport = function() {
	
	var elm = document.documentElement,
		animationstring = 'animation', keyframeprefix = '',
		domPrefixes = 'Webkit Moz O ms Khtml'.split(' '), pfx  = '';
	
	if( elm.style.animationName !== undefined ) { return true; }    

	for( var i = 0; i < domPrefixes.length; i++ ) {
		if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
			
		  pfx = domPrefixes[ i ]; animationstring = pfx + 'Animation';
		  keyframeprefix = '-' + pfx.toLowerCase() + '-';
		  return true;
		}
	}
	
	return false;
}



;/*yepnope1.5.x|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
;( function ( window, doc, undef ) {
  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  yepnope.injectCss = function( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

    // Create stylesheet link
    var link = document.createElement( "link" ),
        onload = function() {
          if ( ! done ) {
            done = 1;
            link.removeAttribute("id");
            setTimeout( cb, 0 );
          }
        },
        id = "yn" + (+new Date()),
        ref, done, i;

    cb = internal ? yepnope.executeStack : ( cb || function(){} );
    timeout = timeout || yepnope.errorTimeout;
    // Add attributes
    link.href = href;
    link.rel  = "stylesheet";
    link.type = "text/css";
    link.id = id;

    // Add our extra attributes to the link element
    for ( i in attrs ) {
      link.setAttribute( i, attrs[ i ] );
    }


    if ( ! err ) {
      ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
      ref.parentNode.insertBefore( link, ref );
      link.onload = onload;

      function poll() {
        try {
            var sheets = document.styleSheets;
            for(var j=0, k=sheets.length; j<k; j++) {
                if(sheets[j].ownerNode.id == id) {
                    // this throws an exception, I believe, if not full loaded (was originally just "sheets[j].cssRules;")
                    if (sheets[j].cssRules.length)
                        return onload();
                }
            }
            // if we get here, its not in document.styleSheets (we never saw the ID)
            throw new Error;
        } catch(e) {
            // Keep polling
            setTimeout(poll, 20);
        }
      }
      poll();
    }
  }
})( this, this.document );

;
function init_navigation() {
	/* Tell the menu we got js - so let's get ready to slide */
	$("nav").addClass("js");
	
	$("#navigation>li").not(".showmobilemenu, #menusearch").each(function() {
		$('<a href="#" class="submenuburger" title="Untermen&uuml; anzeigen"><span class="icon icon_mobile_submenue"></span></a>').insertAfter($(this).find("a:first"));		
	})
	
	/* If not already there, both navigations get the "burger-button" */
	
	if($("#navigation .showmobilemenu").length == 0) {
		$("#navigation").prepend('<li class="showmobilemenu"><a href="#" title="Men&uuml; anzeigen">Men&uuml; <span class="icon icon_mobile_menue"></span></a></li>');
		
		//neue Erkenntnis aus dem Usabilitytest: User erkennen das Menue nicht. Daher soll statt der Seitenstandsanzeige der begriff "Menu" angezeigt werden
				
		$(".mainnav .currentlocation").addClass("hidden");	
		
		
	}

	if($("#branding_navigation .showmobilemenu").length == 0) {
		$("#branding_navigation").prepend('<li class="showmobilemenu"><a href="#" title="Men&uuml; anzeigen"><span class="icon icon_mobile_menue"></span></a></li>');
	}
	
	/* Ein kleiner helfer: navi und brandingnavi ausklappen, ausmessen und die hoehe als data-attribut speichern. wird spaeter fuer's auf und zuklappen verwendet. */
	/* Auskommentiert, weil's momentan nicht funktioniert. Klappt nur, wenn die Seite schon schmal geladen wird */
	/* $("#navigation").css("height","auto").data("natheight", $("#navigation").height()).css("height",0); */
	/* $("#branding_navigation").css("height","auto").data("natheight", $("#branding_navigation").height()).css("height",0); */
	
	/* Klick auf den Burger der Mainnav */
	$("#navigation .showmobilemenu a").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation(); /* klick nciht weiterreichen, damit die navi nciht gleich wieder zuklappt */ 
		if($("#navigation").hasClass("extended")) {
			/* wenn die navi ausgeklappt war, zuklappen */
			$("#navigation").removeClass("extended");
			
			
			/* Seitenstandsanzeiger verbergen */
			//$(".mainnav .currentlocation").removeClass("hidden");
			
			
			/* Beim Zuklappen der Subnavigation Antabben deaktivieren */
			$("#navigation a").not(".showmobilemenu a, #menusearch a").attr("tabindex",-1);
			/* und klickevent vom Bodytag entfernen */
			$("body").unbind();
		}	else {
			/* wenn die branding-nav ausgeklappt ist, die erstmal zumachen */
			if($("#branding_navigation").hasClass("extended")) { $("#branding_navigation .showmobilemenu a").trigger("click") }
			/* Wenn die Suche ausgeklappt ist, die zumachen */
			if($("#menusearch").hasClass("extended")) { $("#menusearch .menusearch").trigger("click") }
			
			
			/* Seitenstandsanzeiger verbergen */			
			//$(".mainnav .currentlocation").addClass("hidden");			
			
			
			/* zum ausklappen bekommt die Navigation die beim Laden gespeicherte Hoehe zugewiesen und die klasse "Extended" */			
			$("#navigation").addClass("extended");
			/* Subnavigationspunkte antabbar machen */
			$("#navigation a").not(".showmobilemenu a, #menusearch a").attr("tabindex",0);
			/* Body bekommt den eventhandler zum Schliessen aller Navigationen - Klick daneben macht alles zu */
			$("body").bind("click", function() { closeAllMenus() })
		}	
	})
	
	/* Nach derselben Logik auch die Branding-Nav behandeln */
	$("#branding_navigation .showmobilemenu a").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		if($("#branding_navigation").hasClass("extended")) {
			$("#branding_navigation").css("height",0).removeClass("extended");
			$("#branding_navigation a").not(".showmobilemenu a").attr("tabindex",-1);
			$("body").unbind();
		}	else {
			if($("#navigation").hasClass("extended")) { $("#navigation .showmobilemenu a").trigger("click") }
			$("#branding_navigation").addClass("extended");
			$("#branding_navigation a").not(".showmobilemenu a").attr("tabindex",0);
			$("body").bind("click", function() { closeAllMenus() })
		}	
	})
	
	/* Klickhandler fuer Submenue. */
	$(".submenuburger").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation(); /* Klickevent nicht an den Body weitergeben */
		if( $(this).parent().hasClass("active") ) {
			$(this).next(".subnav").slideUp(200, function() {
				$(this).parent().removeClass("active");
			});
		} else {
			/* alle Subnavs ausser diesem einfahren */
			$(".subnav").not($(this).next('.subnav')).slideUp(200, function() {
				$(this).parent().removeClass("active");
			})
			/* diese Subnav ausfahren */
			$(this).next(".subnav").slideDown(200,function() {
				$(this).parent().addClass("active");
			});	
		}
	})
	
	$(".menusearch").on("click", function(e) {
		e.preventDefault();
		closeAllMenus();
		/* Fuer die Suchbox die einfachste aller methoden. an oder aus. */
		$("#menusearch").toggleClass("extended");
		if($("#menusearch").hasClass("extended")) {
			$("#searchword").focus();
		}
		
	})
	
	
	//Check Branding Navi light or default
		// ndrtv_4 		= Buecherjournal
		// ndrtv_1287 	= Inas Nacht
		// ndrtv_1378 	= Tietjen und Hirschhausen
		// ndrtv_64 	= Tatort
		// ndrtv_29 	= NDR Talkshow
		// ndrtv_19 	= Kulturjournal
		// ndrtv_1445	= Dalli Dalli
	
	
	//TV Sendungen
	$(".ndrtv_1445 #branding_navigation, .ndrtv_4 #branding_navigation, .ndrtv_1287 #branding_navigation, .ndrtv_1378 #branding_navigation, .ndrtv_64 #branding_navigation, .ndrtv_29 #branding_navigation, .ndrtv_1533 #branding_navigation").addClass("js_bright");
	
	//Sonstiges
	$(".ndrsinfonieorchester #branding_navigation").addClass("js_bright");
	$(".ndrblue #branding_navigation").addClass("js_bright");	
	
	checknavigation();
}

function closeAllMenus() {
	$("nav .extended .showmobilemenu a").trigger("click");
}

function checknavigation() {
	/* KLeine Hilfsfunktion. die per Javascript gesetzten Hoehen muessen entfernt werden, wenn ein User den Browser bei ausgeklapptem Menue breit zieht. Wird bei window.resize getriggert */
	if($(".mainnav li").css("float") == "left") {
		$(".subnav, #navigation, #branding_navigation").attr("style","");
		
	}
	
	if($("#navigation").css("height") == "0px") {
		$("#navigation a, #branding_navigation a").not(".showmobilemenu a, #menusearch a").attr("tabindex",-1);
	}
	
}


;/*
 * jQuery FlexSlider v2.1
 * http://www.woothemes.com/flexslider/
 *
 * Copyright 2012 WooThemes
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: Tyler Smith (@mbmufffin)
 */

;(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el),
        vars = $.extend({}, $.flexslider.defaults, options),
        namespace = vars.namespace,
        touch = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,
        eventType = (touch) ? "touchend" : "click",
        vertical = vars.direction === "vertical",
        reverse = vars.reverse,
        carousel = (vars.itemWidth > 0),
        fade = vars.animation === "fade",
        asNav = vars.asNavFor !== "",
        methods = {};

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Privat slider methods
    methods = {
      init: function() {
        slider.animating = false;
        slider.currentSlide = vars.startAt;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = vars.selector.substr(0,vars.selector.search(' '));
        slider.slides = $(vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(vars.sync).length > 0;
        // SLIDE:
        if (vars.animation === "slide") vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        // TOUCH/USECSS:
        slider.transitions = !vars.video && !fade && vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        // CONTROLSCONTAINER:
        if (vars.controlsContainer !== "") slider.controlsContainer = $(vars.controlsContainer).length > 0 && $(vars.controlsContainer);
        // MANUAL:
        if (vars.manualControls !== "") slider.manualControls = $(vars.manualControls).length > 0 && $(vars.manualControls);

        // RANDOMIZE:
        if (vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (vars.keyboard && ($(slider.containerSelector).length === 1 || vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (vars.pausePlay) methods.pausePlay.setup();

        // SLIDSESHOW
        if (vars.slideshow) {
          if (vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay) slider.play();
            });
          }
          // initialize animation
          (vars.initDelay > 0) ? setTimeout(slider.play, vars.initDelay) : slider.play();
        }

        // TOUCH
        if (touch && vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && vars.smoothHeight)) $(window).bind("resize focus", methods.resize);


        // API: start() Callback
        setTimeout(function(){
          vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          slider.slides.click(function(e){
            e.preventDefault();
            var $slide = $(this),
                target = $slide.index();
            if (!$(vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
              slider.direction = (slider.currentItem < target) ? "next" : "prev";
              slider.flexAnimate(target, vars.pauseOnAction, false, true, true);
            }
          });
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              item = (vars.controlNav === "thumbnails") ? '<img src="' + slider.slides.eq(i).attr("data-thumb") + '"/>' : '<a>' + j + '</a>';
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();
            var $this = $(this),
                target = slider.controlNav.index($this);

            if (!$this.hasClass(namespace + 'active')) {
              slider.direction = (target > slider.currentSlide) ? "next" : "prev";
              slider.flexAnimate(target, vars.pauseOnAction);
            }
          });
          // Prevent iOS click event bug
          if (touch) {
            slider.controlNavScaffold.delegate('a', "click touchstart", function(event) {
              event.preventDefault();
            });
          }
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.live(eventType, function(event) {
            event.preventDefault();
            var $this = $(this),
                target = slider.controlNav.index($this);

            if (!$this.hasClass(namespace + 'active')) {
              (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
              slider.flexAnimate(target, vars.pauseOnAction);
            }
          });
          // Prevent iOS click event bug
          if (touch) {
            slider.controlNav.live("click touchstart", function(event) {
              event.preventDefault();
            });
          }
        },
        set: function() {
          var selector = (vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, vars.pauseOnAction);
          });
          // Prevent iOS click event bug
          if (touch) {
            slider.directionNav.bind("click touchstart", function(event) {
              event.preventDefault();
            });
          }
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass);
          } else if (!vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass);
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass);
            } else {
              slider.directionNav.removeClass(disabledClass);
            }
          } else {
            slider.directionNav.removeClass(disabledClass);
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();
            if ($(this).hasClass(namespace + 'pause')) {
              slider.manualPause = true;
              slider.manualPlay = false;
              slider.pause();
            } else {
              slider.manualPause = false;
              slider.manualPlay = true;
              slider.play();
            }
          });
          // Prevent iOS click event bug
          if (touch) {
            slider.pausePlay.bind("click touchstart", function(event) {
              event.preventDefault();
            });
          }
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').text(vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').text(vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false;

        el.addEventListener('touchstart', onTouchStart, false);
        function onTouchStart(e) {
          if (slider.animating) {
            e.preventDefault();
          } else if (e.touches.length === 1) {
            slider.pause();
            // CAROUSEL:
            cwidth = (vertical) ? slider.h : slider. w;
            startT = Number(new Date());
            // CAROUSEL:
            offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                     (carousel && reverse) ? slider.limit - (((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo) :
                     (carousel && slider.currentSlide === slider.last) ? slider.limit :
                     (carousel) ? ((slider.itemW + vars.itemMargin) * slider.move) * slider.currentSlide :
                     (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
            startX = (vertical) ? e.touches[0].pageY : e.touches[0].pageX;
            startY = (vertical) ? e.touches[0].pageX : e.touches[0].pageY;

            el.addEventListener('touchmove', onTouchMove, false);
            el.addEventListener('touchend', onTouchEnd, false);
          }
        }

        function onTouchMove(e) {
          dx = (vertical) ? startX - e.touches[0].pageY : startX - e.touches[0].pageX;
          scrolling = (vertical) ? (Math.abs(dx) < Math.abs(e.touches[0].pageX - startY)) : (Math.abs(dx) < Math.abs(e.touches[0].pageY - startY));

          if (!scrolling || Number(new Date()) - startT > 500) {
            e.preventDefault();
            if (!fade && slider.transitions) {
              if (!vars.animationLoop) {
                dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
              }
              slider.setProps(offset + dx, "setTouch");
            }
          }
        }

        function onTouchEnd(e) {
          // finish the touch by undoing the touch session
          el.removeEventListener('touchmove', onTouchMove, false);

          if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
            var updateDx = (reverse) ? -dx : dx,
                target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

            if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
              slider.flexAnimate(target, vars.pauseOnAction);
            } else {
              if (!fade) slider.flexAnimate(slider.currentSlide, vars.pauseOnAction, true);
            }
          }
          el.removeEventListener('touchend', onTouchEnd, false);
          startX = null;
          startY = null;
          dx = null;
          offset = null;
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      }
    }

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;
        // API: before() animation Callback
        vars.before(slider);

        // SLIDESHOW:
        if (pause) slider.pause();

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            margin = (vars.itemWidth > slider.w) ? vars.itemMargin * 2 : vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", vars.animationSpeed);
          if (slider.transitions) {
            if (!vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              slider.wrapup(dimension);
            });
          } else {
            slider.container.animate(slider.args, vars.animationSpeed, vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            slider.slides.eq(slider.currentSlide).fadeOut(vars.animationSpeed, vars.easing);
            slider.slides.eq(target).fadeIn(vars.animationSpeed, vars.easing, slider.wrapup);
          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });

            slider.slides.unbind("webkitTransitionEnd transitionend");
            slider.slides.eq(slider.currentSlide).bind("webkitTransitionEnd transitionend", function() {
              // API: after() animation Callback
              vars.after(slider);
            });

            slider.animating = false;
            slider.currentSlide = slider.animatingTo;
          }
        }
        // SMOOTH HEIGHT:
        if (vars.smoothHeight) methods.smoothHeight(vars.animationSpeed);
      }
    }
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      vars.after(slider);
    }

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating) slider.flexAnimate(slider.getTarget("next"));
    }
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.playing = false;
      // PAUSEPLAY:
      if (vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    }
    // SLIDESHOW:
    slider.play = function() {
      slider.animatedSlides = setInterval(slider.animateSlides, vars.slideshowSpeed);
      slider.playing = true;
      // PAUSEPLAY:
      if (vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    }
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    }
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    }

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());
            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);
    }

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(slider.slides.first().clone().addClass('clone')).prepend(slider.slides.last().clone().addClass('clone'));
        }
        slider.newSlides = $(vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            slider.slides.eq(slider.currentSlide).fadeIn(vars.animationSpeed, vars.easing);
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");
    }

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = vars.itemMargin,
          minItems = vars.minItems,
          maxItems = vars.maxItems;

      slider.w = slider.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? maxItems * slider.itemT : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * minItems))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * maxItems))/maxItems :
                       (vars.itemWidth > slider.w) ? slider.w : vars.itemWidth;
        slider.visible = Math.floor(slider.w/(slider.itemW + slideMargin));
        slider.move = (vars.move > 0 && vars.move < slider.visible ) ? vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (vars.itemWidth > slider.w) ? ((slider.itemW + (slideMargin * 2)) * slider.count) - slider.w - slideMargin : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    }

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (vars.directionNav) methods.directionNav.update();

    }

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      vars.added(slider);
    }
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      vars.removed(slider);
    }

    //FlexSlider: Initialize
    methods.init();
  }

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",               //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,             //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "<img src='/resources/images/btn_gallery_sprite.png' alt='zur&uuml;ck' aria-label='zur&uuml;ck' />",           //String: Set the text for the "previous" directionNav item
    nextText: "<img src='/resources/images/btn_gallery_sprite.png' alt='weiter' aria-label='weiter' />",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 0,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){}           //{NEW} Callback: function(slider) - Fires after a slide is removed
  }


  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

        if ($slides.length === 1) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') == undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  }

})(jQuery);

;/* 
	responsiveImages Plugin  - Dynamically exchange Images with Nearest-Match Pattern
	Copyright (c) 2013 NDR (Marc Hueser)
	Aufruf-Beispiel: $(this).responsiveImages();
	Resize-Beispiel: $.responsiveImages.m.resize($.responsiveImages.cfg.containerSelector,exclude); // exclude => Array containing selectors for containers to disable responsiveImages for.
*/

(function($) {
	  
	$.responsiveImages = {
		cfg :	{
					'initialized'		: false,
					'imageNoScriptSelector' : '.image-container noscript',
					'containerSelector' : '',
					'exclude'			: ['.mt_slider', '.stage_slider','.detailview','.twentytwenty-container','.ndrgallerystage'],
					'initSmall'			: ['.ndrgallery', '.ndrgallerystage'],
					'defaultImageType'	: 'einspaltig',
					'imageTypes'		: 	{
												'thumbnailgross'		: 128,
												'einspaltig' 			: 184,								
												'contentklein'		 	: 256,
												'anderthalbspaltig'		: 280,
												'zweispaltig' 			: 376,	
												'ardgrosswidescreen' 	: 512,
												'contentgross'			: 568,
												'vierspaltig'			: 760,
												'ardgalerie' 			: 784,	
												'contentxl' 			: 1067,
												'original' 				: 1067,
												'mediateasersmall'		: 144,
												'podcast'				: 300,
												'quadratl'				: 900,
												'portraits'				: 256,
												'portraitm'				: 384,
												'portraitl'				: 600
											}
				},
		m : {
			init : function(viewport,cfg) {		
				$.responsiveImages.cfg=$.extend($.responsiveImages.cfg, $.responsiveImages.cfg, cfg);	// currently no instancing supported
			
				$.responsiveImages.m.initViewport(viewport);
				
				$(window).imagesLoaded(function( $images, $proper, $broken ) {
					
					$.responsiveImages.m.resize($.responsiveImages.cfg.containerSelector, $.responsiveImages.cfg.exclude);	
					$.responsiveImages.cfg.initialized=true;
				});				
			},
			
			initViewport : function(viewport) {
				
				$(viewport).find($.responsiveImages.cfg.imageNoScriptSelector).each(function() {
					// Images aus den noscript-Tags generiereren
					var noscripttag = $(this);

					var imagesrc = noscripttag.attr('data-basename');	
					
					if(typeof imagesrc!='undefined') {
					
						var noscriptimage = $('<img src="" data-type="'+noscripttag.attr('data-type')+'" alt="'+$.responsiveImages.m.htmlEncode(noscripttag.attr('data-alt'))+'" title="'+$.responsiveImages.m.htmlEncode(noscripttag.attr('data-title'))+'" class="resize" style="width:100%;">');
						
						var availableImageTypes=noscriptimage.attr('data-type');
						if (typeof availableImageTypes!='undefined') availableImageTypes=availableImageTypes.split(",");

						if ($.responsiveImages.m.checkResizeStatus(noscripttag,$.responsiveImages.cfg.initSmall)===true) var width = noscripttag.parent().width();
						else width=64;

						if($.isArray(availableImageTypes)) {
							var imageType=$.responsiveImages.m.getImageType(width,availableImageTypes); 
							$(availableImageTypes).each(function(id,type) {
								imagesrc = imagesrc.replace('v-'+type,'v-{imagetype}');													
							});
						}

						if ($.responsiveImages.m.checkResizeStatus(noscripttag,$.responsiveImages.cfg.exclude)===true) {
							
							noscriptimage.attr('data-basename',imagesrc);
							if(noscriptimage.attr('src')!=imagesrc.replace('v-{imagetype}', 'v-'+imageType)) noscriptimage.attr('src',imagesrc.replace('v-{imagetype}', 'v-'+imageType));
						} else {
							noscriptimage.attr('src','');
							noscriptimage.attr('data-src',imagesrc);
						}
						noscriptimage.insertBefore(noscripttag);
						noscripttag.remove();						
					}
				});
			},
			
			getImageType : function(width,availableImageTypes) {
				
				/* Default 16:9 */
				if(width <= $.responsiveImages.cfg.imageTypes.thumbnailgross && ($.inArray('thumbnailgross', availableImageTypes) >=0)) var imageType='thumbnailgross'; 
				else if(width <= $.responsiveImages.cfg.imageTypes.einspaltig && ($.inArray('einspaltig', availableImageTypes) >=0 )) var imageType='einspaltig';
				else if(width <= $.responsiveImages.cfg.imageTypes.contentklein && ($.inArray('contentklein', availableImageTypes)>=0)) var imageType='contentklein';	
				else if(width <= $.responsiveImages.cfg.imageTypes.anderthalbspaltig && ($.inArray('anderthalbspaltig', availableImageTypes)>=0)) var imageType='anderthalbspaltig';	
				else if(width <= $.responsiveImages.cfg.imageTypes.zweispaltig && ($.inArray('zweispaltig', availableImageTypes)>=0)) var imageType='zweispaltig';	
				else if(width <= $.responsiveImages.cfg.imageTypes.contentgross && ($.inArray('contentgross', availableImageTypes)>=0)) var imageType='contentgross';
				else if(width <= $.responsiveImages.cfg.imageTypes.vierspaltig && ($.inArray('vierspaltig', availableImageTypes)>=0)) var imageType='vierspaltig';
				else if(width <= $.responsiveImages.cfg.imageTypes.ardgrosswidescreen && ($.inArray('ardgrosswidescreen', availableImageTypes)>=0)) var imageType='ardgrosswidescreen';										 
				else if(width <= $.responsiveImages.cfg.imageTypes.ardgalerie && ($.inArray('ardgalerie', availableImageTypes)>=0)) var imageType='ardgalerie';		
				else if(width <= $.responsiveImages.cfg.imageTypes.contentxl && ($.inArray('contentxl', availableImageTypes)>=0)) var imageType='contentxl';	
				
				else {
					if ($.inArray('contentxl', availableImageTypes)>=0) var imageType='contentxl';
					else if($.inArray('ardgalerie', availableImageTypes)>=0) var imageType='ardgalerie';	
					else if($.inArray('ardgrosswidescreen', availableImageTypes)>=0) var imageType='ardgrosswidescreen';
					else if($.inArray('vierspaltig', availableImageTypes)>=0) var imageType='vierspaltig';
					else if($.inArray('contentgross', availableImageTypes)>=0) var imageType='contentgross';
					else if($.inArray('zweispaltig', availableImageTypes)>=0) var imageType='zweispaltig';
					else if($.inArray('anderthalbspaltig', availableImageTypes)>=0) var imageType='anderthalbspaltig';
					else if($.inArray('contentklein', availableImageTypes)>=0) var imageType='contentklein';
					else if($.inArray('einspaltig', availableImageTypes)>=0) var imageType='einspaltig';
					else if($.inArray('thumbnailgross', availableImageTypes)>=0) var imageType='thumbnailgross';
					else var imageType='original';
				}
				
				/* Overwrite for square images */
				if($.inArray('mediateasersmall', availableImageTypes)>=0 || $.inArray('podcast', availableImageTypes)>=0 || $.inArray('quadratl', availableImageTypes)>=0) {					
					if(width <= $.responsiveImages.cfg.imageTypes.mediateasersmall && ($.inArray('mediateasersmall', availableImageTypes)>=0)) var imageType='mediateasersmall';
					else if(width <= $.responsiveImages.cfg.imageTypes.podcast && ($.inArray('podcast', availableImageTypes)>=0)) var imageType='podcast';
					else if(width <= $.responsiveImages.cfg.imageTypes.quadratl && ($.inArray('quadratl', availableImageTypes)>=0)) var imageType='quadratl';				
					else {
						if($.inArray('podcast', availableImageTypes)>=0) var imageType='podcast';	
						else var imageType='mediateasersmall';
					}
				}
				
				/* Overwrite for portrait images */
				if($.inArray('portraits', availableImageTypes)>=0 || $.inArray('portraitl', availableImageTypes)>=0 || $.inArray('portraitm', availableImageTypes)>=0) {					
					if(width <= $.responsiveImages.cfg.imageTypes.portraits && ($.inArray('portraits', availableImageTypes)>=0)) var imageType='portraits';
					else if(width <= $.responsiveImages.cfg.imageTypes.portraitm && ($.inArray('portraitm', availableImageTypes)>=0)) var imageType='portraitm';
					else if(width <= $.responsiveImages.cfg.imageTypes.portraitl && ($.inArray('portraitl', availableImageTypes)>=0)) var imageType='portraitl';				
					else {
						if($.inArray('portraitm', availableImageTypes)>=0) var imageType='portraitm';	
						else var imageType='portraits';
					}
				}
				
				return imageType;
			},
			
			htmlEncode : function(value) {
			    return $('<div/>').text(value).html().replace(/"/g, '&quot;');
			},
			
			checkResizeStatus : function(image,exclude) {
				
				var status;
				status=true;
				
				if(exclude) {
					$(exclude).each(function(id,selector) {
						if(image.closest(selector).length>0) status=false;
					});
				}
				
				return status;
			},
			
			resizeImage : function(image,width) {

				if(typeof image.data('data-basename')=='undefined') {
					var baseName=image.attr('src');
					
					if(image.attr('data-src')) {
						baseName=image.attr('data-src');
						image.attr('data-src','');						
					}
					
					$.each($.responsiveImages.cfg.imageTypes, function(imageType) { 
						baseName=baseName.replace('v-'+imageType,'v-{imagetype}');
					});
					
					image.data('data-basename',baseName);								
				}
				
				var availableImageTypes=image.attr('data-type');
				if (typeof availableImageTypes!='undefined') availableImageTypes=availableImageTypes.split(",");
				else availableImageTypes=$.responsiveImages.cfg.imageTypes;
				
				if($.isArray(availableImageTypes)) {
					
					var imageType=$.responsiveImages.m.getImageType(width,availableImageTypes); 
					var baseName=image.data('data-basename');
					
					if(image.attr('src')!=baseName.replace('v-{imagetype}','v-'+imageType)) image.attr('src',baseName.replace('v-{imagetype}','v-'+imageType));
				}				
			},
			
			resize : function(selector,exclude,force) {
				
				$.responsiveImages.m.initViewport($(selector));
				
				$(selector+' img.resize').each(function() {
					var image=$(this);
					
					if ($.responsiveImages.m.checkResizeStatus(image,exclude)===true) {
						
						if ($.responsiveImages.m.checkResizeStatus(image,$.responsiveImages.cfg.initSmall)===false && force!=true) var width=64;
						else var width=image.width();		
						
						$.responsiveImages.m.resizeImage(image,width);						
					}
				});						
			},		

			resizeViewport : function(viewport,exclude,force) {
				
				$.responsiveImages.m.initViewport(viewport);
				
				viewport.find('img.resize').each(function() {
					var image=$(this);
					
					if ($.responsiveImages.m.checkResizeStatus(image,exclude)===true) {
						
						if ($.responsiveImages.m.checkResizeStatus(image,$.responsiveImages.cfg.initSmall)===false && force!=true) var width=64;
						else var width=image.width();	
						
						$.responsiveImages.m.resizeImage(image,width);
					}
				});						
			}			
			
		}
				
	};
	
	/* jQuery-Objekt erzeugen */
	$.fn.extend({
		responsiveImages:function(method, arguments) {

			var cfg=$.responsiveImages.cfg;
			if (method=='init') $.extend(cfg, cfg, arguments);
			else $.extend(cfg, cfg, method);

			return $.responsiveImages.m.init($(this), cfg);					
		}	
	});		
	
})(jQuery);


;$(document).ready(function() {

	$(".rating").each(function() {
		var ratingset = $(this);
		var rating = Math.round(ratingset.attr('data-rating'));
		
		
		ratingset.find("li:lt("+rating+") span").addClass("on");
		
	})
	
	$(".mplayer_textcontent .features .rating").each(function() {
		var ratingset = $(this);
		var rating = Math.round(ratingset.attr('data-rating'));

		ratingset.find("span")
		.on("mouseenter", function() {
			
			ratingset.find("span").removeClass("on");
			
			var currentrating = $(this).parent().index() +1;
			ratingset.find("li:lt("+currentrating+") span").addClass("sel");
		})
		.on("mouseleave", function() {
			if(ratingPopupIsOpen === true) { return; }
			ratingset.find("span").removeClass("sel");
			ratingset.find("li:lt("+rating+") span").addClass("on");
		})
		.on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			var r = $(this).parent().index() +1;
			
			if(isRated(ratingset) == true) {
				ratingpopup_open(ratingset,"reject",r);
			} else {
				ratingpopup_open(ratingset,"send",r);
			}

		})
	})
})

var ratingPopupIsOpen = false;

function ratingpopup_open(ratingset,p,r) {
	$("body").on("click",function() {
		ratingpopup_close(ratingset);
	})
	ratingPopupIsOpen = true;
	var rating = ratingset.parents(".rating_wrapper");
	rating.find(".rating_confirm").css("display","block").find(".amount").text(r);
	
	rating.find(".panel").removeClass("on");
	rating.find("."+p).addClass("on");
	
	rating.find(".send .button").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		sendRating(ratingset,r);
		updatecookie(ratingset);
		ratingpopup_open(ratingset,"response",r);
	})
	
	rating.find(".response .button, .reject .button").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		ratingpopup_close(ratingset,"response",r);
	})
}

function sendRating(ratingset,r)
{
	var url = '/templates/pages/quizvoting/storeRating.jsp';
	var uuid = ratingset.attr('data-uuid');		
	
	console.log(uuid,r);
	
	var posting = $.post( url, { uuid: uuid, rating: r} );  
		posting.done(function( data ) { 
			console.log(data);
			// success
		});	
		posting.fail(function( data ) {
			console.log(data);
			// error
		});
}

function ratingpopup_close(ratingset) {
	$("body").off();
	ratingPopupIsOpen = false;
	ratingset.parents(".rating_wrapper").find(".rating_confirm").css("display","none").find(".button").off();
	ratingset.find("span").removeClass("sel");
	ratingset.find("li:lt("+ratingset.data("rating")+") span").addClass("on");
}

function isRated(ratingset) {
	var thisid = ratingset.data("uuid");
	var rated = $.cookie("ndrrating");
	if(rated != undefined) {
			rated = rated.split(",")
	}
	console.log(rated,thisid, $.inArray(thisid,rated));
	if($.inArray(thisid,rated) == 0) {
		return true;
	} else {
		return false;
	}
}

function updatecookie(ratingset) {
	var thisid = ratingset.data("uuid");
	var rated = $.cookie("ndrrating");
	if(rated == undefined) {
		$.cookie("ndrrating",thisid);
	} else {
		var rarray = rated.split(",")
		if($.inArray(rarray,thisid)) {
			return;
		} else {
			rated += ","+thisid;
			$.cookie("ndrrating",rating);
		}
	}

}






jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

;$(document).ready(function() {
	var button = $('<a href="#top" id="btt" class="button off"><span class="icon icon_arrow_up"></span>zum Seitenanfang</a>');
	$("body").append(button);
	
	$("#btt").on("click",function(e) {
		e.preventDefault();
		$("html,body").animate({
			"scrollTop": 0
		},1000)		
	})
	
});

$(document).scroll(function() {
	// var s = document.body.scrollTop;
	var s = window.pageYOffset;
	var win = $("body").height();
	
	if(s > win/4) {
		$("#btt").removeClass("off");
	} else {
		$("#btt").addClass("off");
	}
});
;(function() {
	
		/* Autoupdate for selected elements */
		
		$.fn.update = function() {

			return this.each(function(i) {
				
				/* json-sourcefile and initial interval come from a data-attribute */
				/* timer is only relevant for first update. later interval is given in the json */
				var dat = $(this).data("rel").split(",");
				var src = dat[0];
				var timer = dat[1] ? dat[1] : 0;

				/* create individual instances for each element */
				var upd = new Updater($(this),src,timer);
			})			
		}
		
		var Updater = function(el, src, timer,i) {
				this.element = el;
				this.src = src;
				this.timer = timer;	
				this.timestamp = 0;
				
				var that = this;
				this.cycle = window.setTimeout(function(){ that.update() },that.timer);
		
				that.update	=  function() {
					
					$.getJSON(this.src, function(data) {
						remoteData = data;
						
		              	that.timer = remoteData.nextVisitIn;
	              	
		              	if (remoteData.timeStamp != that.timestamp) {              	    
							switch(remoteData.action) {
								case "playlist": that.updatePlaylist(remoteData.song_now,remoteData.song_previous,remoteData.song_next);
									break;
								case "updateList": that.updateList(remoteData.content);
									break;
								case "updateLiveticker": that.updateLiveticker(remoteData.content);
									break;
								default:
									that.updateElement(remoteData.content);
							}
							that.timestamp = remoteData.timeStamp;
						 }				
					});		
					var that = this;
					this.cycle = window.setTimeout(function(){ that.update() },that.timer);				
				}
				
				this.updateElement = function(data) {
					this.element.fadeOut("fast", function() {
						$(this).html(data).fadeIn("fast")
					})			
				}
				
				this.updateLiveticker = function(data) {
					if(this.element.scrollTop() == 0) {
						this.element
								.html(data)
								.find("li:first")
								.slideUp(0)
								.slideDown("fast")	
					}
				}
				
				this.updatePlaylist = function() {
					/* not needed */
				}
				
				this.updateList = function() {
					/* tbd */
				}
			}
		
	})(jQuery)

$(document).ready(function() {

	$(".update").update();
	
})