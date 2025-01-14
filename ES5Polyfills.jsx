if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (typeof Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var array = Object(this);
        var length = array.length >>> 0;

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (var i = fromIndex; i < length; i++) {
            if (i in array && array[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Array.prototype.map !== 'function') {
    Array.prototype.map = function(callback, thisArg) {
        if (this === null) {
            throw new TypeError('Array.prototype.map called on null or undefined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var T = thisArg;
        var A = new Array(len);
        for (var k = 0; k < len; k++) {
            if (k in O) {
                A[k] = callback.call(T, O[k], k, O);
            }
        }
        return A;
    };
}