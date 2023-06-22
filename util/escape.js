const escapeRegExp = function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
};

module.exports = escapeRegExp;