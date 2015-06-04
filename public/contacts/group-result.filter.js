var oss = oss || {};

oss.filters = oss.filters || {};

oss.filters.parseGroupResult = (function() {
	'use strict'
	
	var ParseGroupResult = function(result){
		  var entries = result.data.feed.entry;
            var list = _.map(entries,function parse(item){
                var tmp = {};
                
                tmp.id = item.id.$t;
                tmp.etag = item.gd$etag;
                tmp.content = item.content.$t;
                tmp.title= item.title.$t;
                if(item.gContact$systemGroup){
                    tmp.isSystemGroup = true;
                    tmp.systemGroupId = item.gContact$systemGroup.id;
                }
                
                return tmp;

            })
            return list;
	}
	return function(){
		return ParseGroupResult;
    };
})()