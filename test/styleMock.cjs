// Jest stub for CSS imports — the flavor entries import their stylesheet, but
// jest asserts DOM structure, not styles, so map *.css to an empty module.
module.exports = {};
