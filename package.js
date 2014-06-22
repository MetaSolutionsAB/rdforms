var profile = (function(){
    var testResourceRe = /\/tests\//;
    var converters = /\/converters\//;
    var common = /\/common\//;
    var exclude = /^rdforms\/(node_modules|converters|doc|bin|build|common|html|libs|release|release-layer|samples|templates|local_templates)\//;
    return {
        resourceTags: {
            ignore: function(filename, mid) {
                return exclude.test(mid);
            },
            test: function(filename, mid) {
                return testResourceRe.test(mid);
            },
            amd: function(filename, mid) {
                return /\.js$/.test(filename);
            }
        }
    };
})();