var profile = (function(){
    var testResourceRe = /\/tests\//;
    var converters = /\/converters\//;
    var common = /^rdforms\/common\//;
    return {
        resourceTags: {
	    test: function(filename, mid) {
                return testResourceRe.test(mid) || converters.test(mid);
	    },
            amd: function(filename, mid) {
                return /\.js$/.test(filename) && !testResourceRe.test(mid) && !converters.test(mid) && !common.test(mid);
            }
        }
    };
})();