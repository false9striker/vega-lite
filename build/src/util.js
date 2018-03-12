"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stableStringify = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
var logical_1 = require("./logical");
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
function pick(obj, props) {
    var copy = {};
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    }
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = duplicate(obj);
    for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
        var prop = props_2[_i];
        delete copy[prop];
    }
    return copy;
}
exports.omit = omit;
/**
 * Converts any object into a string representation that can be consumed by humans.
 */
exports.stringify = stableStringify;
/**
 * Converts any object into a string of limited size, or a number.
 */
function hash(a) {
    if (vega_util_1.isNumber(a)) {
        return a;
    }
    var str = vega_util_1.isString(a) ? a : stableStringify(a);
    // short strings can be used as hash directly, longer strings are hashed to reduce memory usage
    if (str.length < 100) {
        return str;
    }
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var h = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        h = ((h << 5) - h) + char;
        h = h & h; // Convert to 32bit integer
    }
    return h;
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) { return !contains(excludedItems, item); });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
/**
 * Returns true if any item returns true.
 */
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * Returns true if all items return true.
 */
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
/**
 * recursively merges src into dest
 */
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
        var s = src_1[_a];
        dest = deepMerge_(dest, s);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
// recursively merges src into dest
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || vega_util_1.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(vega_util_1.isArray(src[p].constructor) ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {};
    var v;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
exports.unique = unique;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
exports.differ = differ;
function hasIntersection(a, b) {
    for (var key in a) {
        if (key in b) {
            return true;
        }
    }
    return false;
}
exports.hasIntersection = hasIntersection;
function isNumeric(num) {
    return !isNaN(num);
}
exports.isNumeric = isNumeric;
function differArray(array, other) {
    if (array.length !== other.length) {
        return true;
    }
    array.sort();
    other.sort();
    for (var i = 0; i < array.length; i++) {
        if (other[i] !== array[i]) {
            return true;
        }
    }
    return false;
}
exports.differArray = differArray;
// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
exports.keys = Object.keys;
function vals(x) {
    var _vals = [];
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
exports.vals = vals;
function flagKeys(f) {
    return exports.keys(f);
}
exports.flagKeys = flagKeys;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;
/**
 * Convert a string into a valid variable name
 */
function varName(s) {
    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
    var alphanumericS = s.replace(/\W/g, '_');
    // Add _ if the string has leading numbers.
    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}
exports.varName = varName;
function logicalExpr(op, cb) {
    if (logical_1.isLogicalNot(op)) {
        return '!(' + logicalExpr(op.not, cb) + ')';
    }
    else if (logical_1.isLogicalAnd(op)) {
        return '(' + op.and.map(function (and) { return logicalExpr(and, cb); }).join(') && (') + ')';
    }
    else if (logical_1.isLogicalOr(op)) {
        return '(' + op.or.map(function (or) { return logicalExpr(or, cb); }).join(') || (') + ')';
    }
    else {
        return cb(op);
    }
}
exports.logicalExpr = logicalExpr;
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
function deleteNestedProperty(obj, orderedProps) {
    var isEmpty = true;
    while (orderedProps.length > 0 && isEmpty) {
        var o = obj;
        for (var i = 0; i < orderedProps.length - 1; i++) {
            o = o[orderedProps[i]];
        }
        delete o[orderedProps.pop()];
        if (exports.keys(o).length !== 0) {
            isEmpty = false;
        }
    }
}
exports.deleteNestedProperty = deleteNestedProperty;
function titlecase(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
exports.titlecase = titlecase;
/**
 * Converts a path to an access path.
 */
function accessPath(path) {
    return "[" + vega_util_1.splitAccessPath(path).map(vega_util_1.stringValue).join('][') + "]";
}
exports.accessPath = accessPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQXlEO0FBQ3pELHVDQUFvRjtBQUNwRixxQ0FBa0Y7QUFHbEY7Ozs7Ozs7OztHQVNHO0FBQ0gsY0FBcUIsR0FBVyxFQUFFLEtBQWU7SUFDL0MsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxDQUFlLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO1FBQW5CLElBQU0sSUFBSSxjQUFBO1FBQ2IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO0tBQ0Y7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9CQVFDO0FBRUQ7OztHQUdHO0FBQ0gsY0FBcUIsR0FBVyxFQUFFLEtBQWU7SUFDL0MsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxDQUFlLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO1FBQW5CLElBQU0sSUFBSSxjQUFBO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkI7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQU5ELG9CQU1DO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBRyxlQUFlLENBQUM7QUFFekM7O0dBRUc7QUFDSCxjQUFxQixDQUFNO0lBQ3pCLEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsSUFBTSxH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dCI6WyJpbXBvcnQgKiBhcyBzdGFibGVTdHJpbmdpZnkgZnJvbSAnanNvbi1zdGFibGUtc3RyaW5naWZ5JztcbmltcG9ydCB7aXNBcnJheSwgaXNOdW1iZXIsIGlzU3RyaW5nLCBzcGxpdEFjY2Vzc1BhdGgsIHN0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtpc0xvZ2ljYWxBbmQsIGlzTG9naWNhbE5vdCwgaXNMb2dpY2FsT3IsIExvZ2ljYWxPcGVyYW5kfSBmcm9tICcuL2xvZ2ljYWwnO1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBvYmplY3QgcHJvcGVydGllcy5cbiAqXG4gKiBFeGFtcGxlOiAgKGZyb20gbG9kYXNoKVxuICpcbiAqIHZhciBvYmplY3QgPSB7J2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzfTtcbiAqIHBpY2sob2JqZWN0LCBbJ2EnLCAnYyddKTtcbiAqIC8vIOKGkiB7J2EnOiAxLCAnYyc6IDN9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGljayhvYmo6IG9iamVjdCwgcHJvcHM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IGNvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BzKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgY29weVtwcm9wXSA9IG9ialtwcm9wXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvcHk7XG59XG5cbi8qKlxuICogVGhlIG9wcG9zaXRlIG9mIF8ucGljazsgdGhpcyBtZXRob2QgY3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIG93blxuICogYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIG9iamVjdCB0aGF0IGFyZSBub3Qgb21pdHRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9taXQob2JqOiBvYmplY3QsIHByb3BzOiBzdHJpbmdbXSkge1xuICBjb25zdCBjb3B5ID0gZHVwbGljYXRlKG9iaik7XG4gIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgIGRlbGV0ZSBjb3B5W3Byb3BdO1xuICB9XG4gIHJldHVybiBjb3B5O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFueSBvYmplY3QgaW50byBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB0aGF0IGNhbiBiZSBjb25zdW1lZCBieSBodW1hbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSBzdGFibGVTdHJpbmdpZnk7XG5cbi8qKlxuICogQ29udmVydHMgYW55IG9iamVjdCBpbnRvIGEgc3RyaW5nIG9mIGxpbWl0ZWQgc2l6ZSwgb3IgYSBudW1iZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNoKGE6IGFueSkge1xuICBpZiAoaXNOdW1iZXIoYSkpIHtcbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGNvbnN0IHN0ciA9IGlzU3RyaW5nKGEpID8gYSA6IHN0YWJsZVN0cmluZ2lmeShhKTtcblxuICAvLyBzaG9ydCBzdHJpbmdzIGNhbiBiZSB1c2VkIGFzIGhhc2ggZGlyZWN0bHksIGxvbmdlciBzdHJpbmdzIGFyZSBoYXNoZWQgdG8gcmVkdWNlIG1lbW9yeSB1c2FnZVxuICBpZiAoc3RyLmxlbmd0aCA8IDEwMCkge1xuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICAvLyBmcm9tIGh0dHA6Ly93ZXJ4bHRkLmNvbS93cC8yMDEwLzA1LzEzL2phdmFzY3JpcHQtaW1wbGVtZW50YXRpb24tb2YtamF2YXMtc3RyaW5nLWhhc2hjb2RlLW1ldGhvZC9cbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXIgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBoID0gKChoPDw1KS1oKStjaGFyO1xuICAgIGggPSBoICYgaDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cbiAgcmV0dXJuIGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluczxUPihhcnJheTogVFtdLCBpdGVtOiBUKSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBhcnJheSB3aXRob3V0IHRoZSBlbGVtZW50cyBpbiBpdGVtICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aG91dDxUPihhcnJheTogVFtdLCBleGNsdWRlZEl0ZW1zOiBUW10pIHtcbiAgcmV0dXJuIGFycmF5LmZpbHRlcihpdGVtID0+ICFjb250YWlucyhleGNsdWRlZEl0ZW1zLCBpdGVtKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlvbjxUPihhcnJheTogVFtdLCBvdGhlcjogVFtdKSB7XG4gIHJldHVybiBhcnJheS5jb25jYXQod2l0aG91dChvdGhlciwgYXJyYXkpKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYW55IGl0ZW0gcmV0dXJucyB0cnVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29tZTxUPihhcnI6IFRbXSwgZjogKGQ6IFQsIGs/OiBhbnksIGk/OiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKGxldCBrID0gMDsgazxhcnIubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoZihhcnJba10sIGssIGkrKykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGFsbCBpdGVtcyByZXR1cm4gdHJ1ZS5cbiAqL1xuIGV4cG9ydCBmdW5jdGlvbiBldmVyeTxUPihhcnI6IFRbXSwgZjogKGQ6IFQsIGs/OiBhbnksIGk/OiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKGxldCBrID0gMDsgazxhcnIubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoIWYoYXJyW2tdLCBrLCBpKyspKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihhcnJheXM6IGFueVtdKSB7XG4gIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIGFycmF5cyk7XG59XG5cbi8qKlxuICogcmVjdXJzaXZlbHkgbWVyZ2VzIHNyYyBpbnRvIGRlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVlcDxUPihkZXN0OiBULCAuLi5zcmM6IFBhcnRpYWw8VD5bXSk6IFQge1xuICBmb3IgKGNvbnN0IHMgb2Ygc3JjKSB7XG4gICAgZGVzdCA9IGRlZXBNZXJnZV8oZGVzdCwgcyk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBkZWVwTWVyZ2VfKGRlc3Q6IGFueSwgc3JjOiBhbnkpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yIChjb25zdCBwIGluIHNyYykge1xuICAgIGlmICghc3JjLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNyY1twXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzcmNbcF0gIT09ICdvYmplY3QnIHx8IGlzQXJyYXkoc3JjW3BdKSB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlRGVlcChpc0FycmF5KHNyY1twXS5jb25zdHJ1Y3RvcikgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZURlZXAoZGVzdFtwXSwgc3JjW3BdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWU8VD4odmFsdWVzOiBUW10sIGY6IChpdGVtOiBUKSA9PiBzdHJpbmcgfCBudW1iZXIpOiBUW10ge1xuICBjb25zdCByZXN1bHRzOiBhbnlbXSA9IFtdO1xuICBjb25zdCB1ID0ge307XG4gIGxldCB2OiBzdHJpbmcgfCBudW1iZXI7XG4gIGZvciAoY29uc3QgdmFsIG9mIHZhbHVlcykge1xuICAgIHYgPSBmKHZhbCk7XG4gICAgaWYgKHYgaW4gdSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHVbdl0gPSAxO1xuICAgIHJlc3VsdHMucHVzaCh2YWwpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpY3Q8VD4ge1xuICBba2V5OiBzdHJpbmddOiBUO1xufVxuXG5leHBvcnQgdHlwZSBTdHJpbmdTZXQgPSBEaWN0PHRydWU+O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIGRpY3Rpb25hcmllcyBkaXNhZ3JlZS4gQXBwbGllcyBvbmx5IHRvIGRlZmluZWQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyPFQ+KGRpY3Q6IERpY3Q8VD4sIG90aGVyOiBEaWN0PFQ+KSB7XG4gIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcbiAgICBpZiAoZGljdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBpZiAob3RoZXJba2V5XSAmJiBkaWN0W2tleV0gJiYgb3RoZXJba2V5XSAhPT0gZGljdFtrZXldKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbnRlcnNlY3Rpb24oYTogU3RyaW5nU2V0LCBiOiBTdHJpbmdTZXQpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gYSkge1xuICAgIGlmIChrZXkgaW4gYikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyhudW06IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gIWlzTmFOKG51bSBhcyBhbnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyQXJyYXk8VD4oYXJyYXk6IFRbXSwgb3RoZXI6IFRbXSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9PSBvdGhlci5sZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFycmF5LnNvcnQoKTtcbiAgb3RoZXIuc29ydCgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3RoZXJbaV0gIT09IGFycmF5W2ldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFRoaXMgaXMgYSBzdHJpY3RlciB2ZXJzaW9uIG9mIE9iamVjdC5rZXlzIGJ1dCB3aXRoIGJldHRlciB0eXBlcy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9wdWxsLzEyMjUzI2lzc3VlY29tbWVudC0yNjMxMzIyMDhcbmV4cG9ydCBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMgYXMgPFQ+KG86IFQpID0+IChrZXlvZiBUKVtdO1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsczxUPih4OiB7W2tleTogc3RyaW5nXTogVH0pOiBUW10ge1xuICBjb25zdCBfdmFsczogVFtdID0gW107XG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgaWYgKHguaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIF92YWxzLnB1c2goeFtrXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfdmFscztcbn1cblxuLy8gVXNpbmcgbWFwcGVkIHR5cGUgdG8gZGVjbGFyZSBhIGNvbGxlY3Qgb2YgZmxhZ3MgZm9yIGEgc3RyaW5nIGxpdGVyYWwgdHlwZSBTXG4vLyBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuZXhwb3J0IHR5cGUgRmxhZzxTIGV4dGVuZHMgc3RyaW5nPiA9IHtcbiAgW0sgaW4gU106IDFcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGFnS2V5czxTIGV4dGVuZHMgc3RyaW5nPihmOiBGbGFnPFM+KTogU1tdIHtcbiAgcmV0dXJuIGtleXMoZikgYXMgU1tdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHVwbGljYXRlPFQ+KG9iajogVCk6IFQge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbihiOiBhbnkpOiBiIGlzIGJvb2xlYW4ge1xuICByZXR1cm4gYiA9PT0gdHJ1ZSB8fCBiID09PSBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIGludG8gYSB2YWxpZCB2YXJpYWJsZSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJOYW1lKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFJlcGxhY2Ugbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChhbnl0aGluZyBiZXNpZGVzIGEtekEtWjAtOV8pIHdpdGggX1xuICBjb25zdCBhbHBoYW51bWVyaWNTID0gcy5yZXBsYWNlKC9cXFcvZywgJ18nKTtcblxuICAvLyBBZGQgXyBpZiB0aGUgc3RyaW5nIGhhcyBsZWFkaW5nIG51bWJlcnMuXG4gIHJldHVybiAocy5tYXRjaCgvXlxcZCsvKSA/ICdfJyA6ICcnKSArIGFscGhhbnVtZXJpY1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpY2FsRXhwcjxUPihvcDogTG9naWNhbE9wZXJhbmQ8VD4sIGNiOiBGdW5jdGlvbik6IHN0cmluZyB7XG4gIGlmIChpc0xvZ2ljYWxOb3Qob3ApKSB7XG4gICAgcmV0dXJuICchKCcgKyBsb2dpY2FsRXhwcihvcC5ub3QsIGNiKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxBbmQob3ApKSB7XG4gICAgcmV0dXJuICcoJyArIG9wLmFuZC5tYXAoKGFuZDogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKGFuZCwgY2IpKS5qb2luKCcpICYmICgnKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxPcihvcCkpIHtcbiAgICByZXR1cm4gJygnICsgb3Aub3IubWFwKChvcjogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKG9yLCBjYikpLmpvaW4oJykgfHwgKCcpICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjYihvcCk7XG4gIH1cbn1cblxuLy8gT21pdCBmcm9tIGh0dHA6Ly9pZGVhc2ludG9zb2Z0d2FyZS5jb20vdHlwZXNjcmlwdC1hZHZhbmNlZC10cmlja3MvXG5leHBvcnQgdHlwZSBEaWZmPFQgZXh0ZW5kcyBzdHJpbmcsIFUgZXh0ZW5kcyBzdHJpbmc+ID0gKHtbUCBpbiBUXTogUCB9ICYge1tQIGluIFVdOiBuZXZlciB9ICYgeyBbeDogc3RyaW5nXTogbmV2ZXIgfSlbVF07XG5leHBvcnQgdHlwZSBPbWl0PFQsIEsgZXh0ZW5kcyBrZXlvZiBUPiA9IHtbUCBpbiBEaWZmPGtleW9mIFQsIEs+XTogVFtQXX07XG5cbi8qKlxuICogRGVsZXRlIG5lc3RlZCBwcm9wZXJ0eSBvZiBhbiBvYmplY3QsIGFuZCBkZWxldGUgdGhlIGFuY2VzdG9ycyBvZiB0aGUgcHJvcGVydHkgaWYgdGhleSBiZWNvbWUgZW1wdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvYmo6IGFueSwgb3JkZXJlZFByb3BzOiBzdHJpbmdbXSkge1xuICBsZXQgaXNFbXB0eSA9IHRydWU7XG4gIHdoaWxlIChvcmRlcmVkUHJvcHMubGVuZ3RoID4gMCAmJiBpc0VtcHR5KSB7XG4gICAgbGV0IG8gPSBvYmo7XG4gICAgZm9yIChsZXQgaT0wOyBpIDwgb3JkZXJlZFByb3BzLmxlbmd0aC0xOyBpKyspIHtcbiAgICAgIG8gPSBvW29yZGVyZWRQcm9wc1tpXV07XG4gICAgfVxuICAgIGRlbGV0ZSBvW29yZGVyZWRQcm9wcy5wb3AoKV07XG4gICAgaWYgKGtleXMobykubGVuZ3RoICE9PSAwKSB7XG4gICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZWNhc2Uoczogc3RyaW5nKSB7XG4gIHJldHVybiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zdWJzdHIoMSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBwYXRoIHRvIGFuIGFjY2VzcyBwYXRoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWNjZXNzUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBbJHtzcGxpdEFjY2Vzc1BhdGgocGF0aCkubWFwKHN0cmluZ1ZhbHVlKS5qb2luKCddWycpfV1gO1xufVxuIl19