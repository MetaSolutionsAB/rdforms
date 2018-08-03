define([], () => {
  /**
   * Copied and modified from Underscore.js
   *
   * @param func
   * @param wait
   * @param options
   * @return {Function}
   * @see http://underscorejs.org/#throttle
   */
  const throttle = (func, wait, options) => {
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    const later = function () {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        args = null;
        context = args;
      }
    };
    return function () {
      const now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          args = null;
          context = args;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  return {
    throttle,
  };
});
