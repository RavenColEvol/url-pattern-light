// iife module pattern
((root, factory) => {
    // require js amd define pattern
    if ('function' === typeof define && define.amd !== null)
      define([], factory)
    //   common js by browserify
    else if (typeof exports !== 'undefined' && exports !== null) { 
        module.exports = factory()
    }
    else
      root.UrlPattern = factory();
}
)(this, () => {
    var getEscapedRegex = str => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    var UrlPattern = function(url) {
      this.output = {};
      this.opArray = [];

      //1. Convert the given string to escape regex
      url = getEscapedRegex(url);

      //2. Replace variables with regex that will capture the value
      url = url.replace(/(:[0-9a-zA-Z_]+)/gm, (match) => {
        var identifier = match.slice(1);
        this.output[identifier] = null;
        this.opArray.push(identifier);
        return '([a-zA-Z0-9-_~ %]+)'
      });

      this.regex = new RegExp(url);
    }

    UrlPattern.prototype.match = function(url) {
      var valueArray = this.regex.exec(url).slice(1, this.opArray.length + 1);
      this.opArray.forEach((key, id) => {
        if(this.output[key]) this.output[key].push(valueArray[id]);
        else this.output[key] = [valueArray[id]];
      })
      return this.output;
    }

    return UrlPattern;
});
