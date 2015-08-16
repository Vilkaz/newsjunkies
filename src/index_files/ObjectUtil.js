function ObjectUtil(){};
ObjectUtil.prototype = {
    extendObject: function(source,destination) {
        var ret = {};
        for (var property in source){			
            ret[property] = source[property]; 
            if(typeof source[property] == 'function') ret['super_'+property] = source[property];
        }
        for (var property in destination){
            ret[property] = destination[property];
        }
        return ret;
    },
    stringTrim: function(string) {
        return string.replace(/^\s+|\s+$/g, '');
    }
}

var objectUtil = new ObjectUtil();
