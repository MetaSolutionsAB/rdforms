({
    baseUrl: "../libs",
    dir: "../dist/",
    //out: "../dist/rdforms.js",
    name: "rdforms",
    create: true,
    deps: [
        "rdfjson/Graph",
        "rdforms/model/Engine",
        "rdforms/template/ItemStore"
    ],
    paths: {
        "rdforms": ".."
    },
    skipDirOptimize: true,
    removeCombined: true,
    fileExclusionRegExp: /^(\.|node_modules|release|dist)/
})