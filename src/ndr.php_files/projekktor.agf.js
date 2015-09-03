/*
 *
 * Projekktor AGF Nielsen Plugin
 */
var projekktorAgf = function () {};
jQuery(function ($) {
    projekktorAgf.prototype = {
        reqVer: '1.4.00',
        version: '1.0.0',

        _timer: 0,
        _metaString: '',
        _seekedFrom: false,
        config: {
            apiUrl: false, // "http://www.ndr.de/epg/siebentage1579~agf.json",
        	beaconUrl: "//secure-eu.imrworldwide.com/novms/js/2/ggcmb390.js",
            queryInterval: 2
        },

        initialize: function () {
        	var ref = this,
        		myEvent = window.attachEvent || window.addEventListener,
        		chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; 
        	
        	try { new gg(); } catch(e) {

	        	$.ajax({
	                type: "GET",
	                url: this.getConfig('beaconUrl'),
	                dataType: "script",
	                error: function (XMLHttpRequest, textStatus, errorThrown) {
	                	ref.pluginReady = true;
	                },
	                timeout: 5000,
	                success:function(){
	                    ref.pluginReady = true;
	                }
	            });	        	
        	}  

        	
            myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
                ref.eventHandler('beforeunload', 0, ref);
            });
            
        	            
        },

        itemHandler: function () {        	
            this.pluginReady = false;
            this._timer = 0;
            if (this.getConfig('apiUrl')!=false) {
                this.pp.getFromUrl(this.getConfig('apiUrl'), this, "_agfLoaded", 'json');            
                this.gg = new gg();
                return;
            }
            this.pluginReady = true;
        },

        eventHandler: function (event, value, player) {
            var ggCode = 0,
            	secondValue = false;

            if (!this.pluginReady) return;

            switch(event) {
                case 'state':
                    switch (value) {
                    	case 'STARTING':
                			try {
                				this.gg.ggPM("15", this.pp.getSource(), 'content', this._metaString);
                				return;
                			} catch (e) {}
                    		break;
                        case 'PAUSED':
                            ggCode = 6;
                            value = this.pp.getPosition();
                            break;
                        case 'COMPLETED':
                            ggCode = 7;
                            value = this.pp.getDuration();
                            break;                            
                    }
                    break;
                case 'resume':
                    ggCode = 5;
                    value = this.pp.getPosition();
                    break;
                case 'fullscreen':
                    ggCode = 10;
                    break;
                case 'mute':
                    ggCode = 9;
                    break;
                case 'seek':
                    if (value=='SEEKED') {
                    	this._seekedFrom = this.pp.getPosition();
                    }
                    break;
                case 'time':
                    if(Math.abs((this._timer - value)) > this.getConfig('queryInterval')){
                        this._timer = value;
                        value = value.toFixed(1);
                        ggCode = 49;
                    }
                    if (this._seekedFrom!=false) {                    	
                    	secondValue = value;
                    	value = this._seekedFrom;
                    	ggCode = 8;
                    	this._seekedFrom = false;
                    	
                    }
                    break;
                case 'error':
                	ggCode = 4;
                	break;
                case 'done':
                    ggCode = 4;
                    value = this.pp.getDuration();
                    break;         
                case 'beforeunload':
                    ggCode = 7;
                    value = this.pp.getPosition();
                	break;
            }

            if (ggCode>1) {
                this.gg.ggPM(ggCode, value, secondValue);
            }
            
           
        },        

        _agfLoaded: function() {
            try {
                var data = arguments[0].metadata_0,
                	ref = this;

            	data.c5 = window.location.href;
            	var nolggGlobalParams = {
        			clientid: data.ci,
        			vcid: data.c6,
        			sfcode: "eu",
                    prod: "vc"
                 };

            	delete data.c6;
            	delete data.ci;
            	$.each(data, function(key, value) {
            		key2 = key.replace(/^c/, "p");
            		switch(key.charAt(0)){
            			case "c":
            				ref._metaString += '<nol_' + key + '>' + key2 +',' + value + '</nol_'+ key +'>';
            				break;
        				default:
            				ref._metaString += '<' + key + '>' + value + '</'+ key +'>';
            		}
                	
                	
                })

                nolggGlobalParams = $.extend(true, nolggGlobalParams, data, {});

                this.gg.ggInitialize(nolggGlobalParams, this.getConfig('uid'), false, false);                

            } catch(e) {}

            this.pluginReady = true;
        }
    }
});