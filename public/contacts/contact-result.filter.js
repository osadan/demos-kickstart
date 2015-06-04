var oss = oss || {};

oss.filters = oss.filters || {};

oss.filters.parseContactResult = (function() {
    'use strict'
    var ParseContactResult = function(result) {
        
        var entries = result.data.feed.entry;
        var list = [];
        list = _.map(entries, function(item) {

            var tmp = {};
            tmp.id = item.id.$t;
            if (item.gd$etag) {
                tmp.etag = item.gd$etag;
            }
            if (item.gd$email && item.gd$email.length > 0) {
                tmp.email = _.map(item.gd$email, function(emailItem) {
                    return emailItem.address;
                })

            }
            if (item.gd$name) {
                tmp.name = item.gd$name;
            }
            if (item.title.$t) {
                tmp.title = item.title.$t;
            }
            if (item.gContact$website && item.gContact$website.length > 0) {
                tmp.website = _.map(item.gContact$website, function(websiteItem) {
                    return websiteItem.href;
                })
            }
            if (item.link) {
                tmp.link = item.link;
            }
            if (item.gd$phoneNumber) {
                tmp.phone = item.gd$phoneNumber;
            }

            //search also for images
            return tmp;
        })
        return list;
    }

    return function(){
    	return ParseContactResult
    };

})()
