var profile = (function(){
    var testResourceRe = /\/tests\//;
    return {
        resourceTags: {
	    test: function(filename, mid) {
                return testResourceRe.test(mid);
	    },
            amd: function(filename, mid) {
                return /\.js$/.test(filename) && !testResourceRe.test(mid);
            }
        }
    };
})();