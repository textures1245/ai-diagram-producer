import * as util from "node:util";

if (typeof util.inherits !== "function") {
  Object.defineProperty(util, "inherits", {
    value: function (ctor: Function, superCtor: Function): void {
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true,
        },
      });
    },
  });
}
