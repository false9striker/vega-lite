"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var selection_1 = require("./compile/selection/selection");
var datetime_1 = require("./datetime");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isSelectionFilter(filter) {
    return filter && filter['selection'];
}
exports.isSelectionFilter = isSelectionFilter;
function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
exports.isEqualFilter = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && filter.field) {
        if (util_1.isArray(filter.range) && filter.range.length === 2) {
            return true;
        }
    }
    return false;
}
exports.isRangeFilter = isRangeFilter;
function isOneOfFilter(filter) {
    return filter && !!filter.field && (util_1.isArray(filter.oneOf) ||
        util_1.isArray(filter.in) // backward compatibility
    );
}
exports.isOneOfFilter = isOneOfFilter;
function isFieldFilter(filter) {
    return isOneOfFilter(filter) || isEqualFilter(filter) || isRangeFilter(filter);
}
exports.isFieldFilter = isFieldFilter;
/**
 * Converts a filter into an expression.
 */
// model is only used for selection filters.
function expression(model, filterOp, node) {
    return util_1.logicalExpr(filterOp, function (filter) {
        if (util_1.isString(filter)) {
            return filter;
        }
        else if (isSelectionFilter(filter)) {
            return selection_1.predicate(model, filter.selection, node);
        }
        else {
            return fieldFilterExpression(filter);
        }
    });
}
exports.expression = expression;
// This method is used by Voyager.  Do not change its behavior without changing Voyager.
function fieldFilterExpression(filter, useInRange) {
    if (useInRange === void 0) { useInRange = true; }
    var fieldExpr = filter.timeUnit ?
        // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
        // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
        // TODO: support utc
        ('time(' + timeunit_1.fieldExpr(filter.timeUnit, filter.field) + ')') :
        fielddef_1.field(filter, { expr: 'datum' });
    if (isEqualFilter(filter)) {
        return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
    }
    else if (isOneOfFilter(filter)) {
        // "oneOf" was formerly "in" -- so we need to add backward compatibility
        var oneOf = filter.oneOf || filter['in'];
        return 'indexof([' +
            oneOf.map(function (v) { return valueExpr(v, filter.timeUnit); }).join(',') +
            '], ' + fieldExpr + ') !== -1';
    }
    else if (isRangeFilter(filter)) {
        var lower = filter.range[0];
        var upper = filter.range[1];
        if (lower !== null && upper !== null && useInRange) {
            return 'inrange(' + fieldExpr + ', [' +
                valueExpr(lower, filter.timeUnit) + ', ' +
                valueExpr(upper, filter.timeUnit) + '])';
        }
        var exprs = [];
        if (lower !== null) {
            exprs.push(fieldExpr + " >= " + valueExpr(lower, filter.timeUnit));
        }
        if (upper !== null) {
            exprs.push(fieldExpr + " <= " + valueExpr(upper, filter.timeUnit));
        }
        return exprs.length > 0 ? exprs.join(' && ') : 'true';
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error("Invalid field filter: " + JSON.stringify(filter));
}
exports.fieldFilterExpression = fieldFilterExpression;
function valueExpr(v, timeUnit) {
    if (datetime_1.isDateTime(v)) {
        var expr = datetime_1.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit_1.isLocalSingleTimeUnit(timeUnit)) {
        var datetime = {};
        datetime[timeUnit] = v;
        var expr = datetime_1.dateTimeExpr(datetime, true);
        return 'time(' + expr + ')';
    }
    else if (timeunit_1.isUtcSingleTimeUnit(timeUnit)) {
        return valueExpr(v, timeunit_1.getLocalTimeUnit(timeUnit));
    }
    return JSON.stringify(v);
}
function normalizeFilter(f) {
    if (isFieldFilter(f) && f.timeUnit) {
        return tslib_1.__assign({}, f, { timeUnit: timeunit_1.normalizeTimeUnit(f.timeUnit) });
    }
    return f;
}
exports.normalizeFilter = normalizeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyREFBd0Q7QUFDeEQsdUNBQThEO0FBQzlELHVDQUFpQztBQUVqQyx1Q0FBcUo7QUFDckosK0JBQXNEO0FBa0J0RCwyQkFBa0MsTUFBOEI7SUFDOUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELDhDQUVDO0FBc0JELHVCQUE4QixNQUFXO0lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssS0FBRyxTQUFTLENBQUM7QUFDOUQsQ0FBQztBQUZELHNDQUVDO0FBeUJELHVCQUE4QixNQUFXO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCxzQ0FPQztBQXVCRCx1QkFBOEIsTUFBVztJQUN2QyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQ2pDLGNBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JCLGNBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMseUJBQXlCO0tBQzdDLENBQUM7QUFDSixDQUFDO0FBTEQsc0NBS0M7QUFFRCx1QkFBOEIsTUFBYztJQUMxQyxNQUFNLENBQUMsYUFBYSxDQUFD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