String.prototype.formatWithArray = function (_array) {
    var s = this;
    for (var i = 0; i < _array.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, _array[i]);
    }
    return s;
};
//# sourceMappingURL=formatWithArray.js.map