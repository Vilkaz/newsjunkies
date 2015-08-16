function getivw() {
	var ak_stat = "tagessch";
	var ak_mobi = "mobtages";
	function isStringDetected(value) {
		var regexp = new RegExp(value, "gi");
		return (regexp.test(navigator.appVersion) || regexp.test (navigator.userAgent)) ? true : false;
	}
	function isTablet() {
		if(isStringDetected("iPad") || (isStringDetected("Android") && !isStringDetected("Mobile"))) {
			return true;
		}
		return false;
	}
	
	/* SZMnG-Tag Responsiv-Weiche */
	jQuery.ajaxSetup({ cache: true });
	jQuery.getScript("https://script.ioam.de/iam.js").done(function() {
		var isMobil = typeof orientation!='undefined' ? true:false;
		if(isTablet()) { isMobil = false; } // Tablets sind stationaer
		if(!isMobil) {
			var iam_data = {
				"st" : ak_stat,
				"cp" : "tagesschstat"
			};
		} else {
			var iam_data = {
				"st" : ak_mobi,
				"cp" : "tagesschmobi"
			};
		}	
		iom.c(iam_data,1);
	});
}