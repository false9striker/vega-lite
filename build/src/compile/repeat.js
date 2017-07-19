"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var util_1 = require("../util");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var assemble_2 = require("./layout/assemble");
var parse_2 = require("./layout/parse");
var parse_3 = require("./legend/parse");
var model_1 = require("./model");
function replaceRepeaterInFacet(facet, repeater) {
    return replaceRepeater(facet, repeater);
}
exports.replaceRepeaterInFacet = replaceRepeaterInFacet;
function replaceRepeaterInEncoding(encoding, repeater) {
    return replaceRepeater(encoding, repeater);
}
exports.replaceRepeaterInEncoding = replaceRepeaterInEncoding;
/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef, repeater) {
    var field = fieldDef.field;
    if (fielddef_1.isRepeatRef(field)) {
        if (field.repeat in repeater) {
            return tslib_1.__assign({}, fieldDef, { field: repeater[field.repeat] });
        }
        else {
            log.warn(log.message.noSuchRepeatedValue(field.repeat));
            return null;
        }
    }
    else {
        // field is not a repeat ref so we can just return the field def
        return fieldDef;
    }
}
function replaceRepeater(mapping, repeater) {
    var out = {};
    for (var channel in mapping) {
        if (mapping.hasOwnProperty(channel)) {
            var fieldDef = mapping[channel];
            if (vega_util_1.isArray(fieldDef)) {
                out[channel] = fieldDef.map(function (fd) { return replaceRepeaterInFieldDef(fd, repeater); })
                    .filter(function (fd) { return fd !== null; });
            }
            else {
                var fd = replaceRepeaterInFieldDef(fieldDef, repeater);
                if (fd !== null) {
                    out[channel] = fd;
                }
            }
        }
    }
    return out;
}
var RepeatModel = (function (_super) {
    tslib_1.__extends(RepeatModel, _super);
    function RepeatModel(spec, parent, parentGivenName, repeatValues, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.repeat = spec.repeat;
        _this.children = _this._initChildren(spec, _this.repeat, repeatValues, config);
        return _this;
    }
    RepeatModel.prototype._initChildren = function (spec, repeat, repeater, config) {
        var children = [];
        var row = repeat.row || [repeater ? repeater.row : null];
        var column = repeat.column || [repeater ? repeater.column : null];
        // cross product
        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var rowField = row_1[_i];
            for (var _a = 0, column_1 = column; _a < column_1.length; _a++) {
                var columnField = column_1[_a];
                var name_1 = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');
                var childRepeat = {
                    row: rowField,
                    column: columnField
                };
                children.push(common_1.buildModel(spec.spec, this, this.getName('child' + name_1), undefined, childRepeat, config));
            }
        }
        return children;
    };
    RepeatModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    };
    RepeatModel.prototype.parseLayoutSize = function () {
        parse_2.parseRepeatLayoutSize(this);
    };
    RepeatModel.prototype.parseSelection = function () {
        var _this = this;
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        var _loop_1 = function (child) {
            child.parseSelection();
            util_1.keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_1(child);
        }
    };
    RepeatModel.prototype.parseMarkGroup = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMarkGroup();
        }
    };
    RepeatModel.prototype.parseAxisAndHeader = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
        // TODO(#2415): support shared axes
    };
    RepeatModel.prototype.parseLegend = function () {
        parse_3.parseNonUnitLegend(this);
    };
    RepeatModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(this.component.data);
        }
        return [];
    };
    RepeatModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    RepeatModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.children.reduce(function (sg, child) { return child.assembleSelectionTopLevelSignals(sg); }, signals);
    };
    RepeatModel.prototype.assembleSelectionSignals = function () {
        this.children.forEach(function (child) { return child.assembleSelectionSignals(); });
        return [];
    };
    RepeatModel.prototype.assembleLayoutSignals = function () {
        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, assemble_2.assembleLayoutSignals(this));
    };
    RepeatModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, []);
    };
    RepeatModel.prototype.assembleLayout = function () {
        // TODO: allow customization
        return {
            padding: { row: 10, column: 10 },
            offset: 10,
            columns: this.repeat && this.repeat.column ? this.repeat.column.length : 1,
            bounds: 'full',
            align: 'all'
        };
    };
    RepeatModel.prototype.assembleMarks = function () {
        // only children have marks
        return this.children.map(function (child) {
            var encodeEntry = child.assembleParentGroupProperties();
            return tslib_1.__assign({ type: 'group', name: child.getName('group') }, (encodeEntry ? {
                encode: {
                    update: encodeEntry
                }
            } : {}), child.assembleGroup());
        });
    };
    return RepeatModel;
}(model_1.Model));
exports.RepeatModel = RepeatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUtsQyx3Q0FBeUQ7QUFDekQsNEJBQThCO0FBSTlCLGdDQUFtQztBQUVuQyxtQ0FBb0M7QUFDcEMsNENBQTZDO0FBQzdDLHNDQUF1QztBQUN2Qyw4Q0FBd0Q7QUFDeEQsd0NBQXFEO0FBQ3JELHdDQUFrRDtBQUNsRCxpQ0FBOEI7QUFVOUIsZ0NBQXVDLEtBQW1CLEVBQUUsUUFBdUI7SUFDakYsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFrQixDQUFDO0FBQzNELENBQUM7QUFGRCx3REFFQztBQUVELG1DQUEwQyxRQUF5QixFQUFFLFFBQXVCO0lBQzFGLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBcUIsQ0FBQztBQUNqRSxDQUFDO0FBRkQsOERBRUM7QUFFRDs7R0FFRztBQUNILG1DQUFtQyxRQUF5QixFQUFFLFFBQXVCO0lBQ25GLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDN0IsRUFBRSxDQUFDLENBQUMsc0JBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sc0JBQ0QsUUFBUSxJQUNYLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUM3QjtRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLGdFQUFnRTtRQUNoRSxNQUFNLENBQUMsUUFBNEIsQ0FBQztJQUN0QyxDQUFDO0FBQ0gsQ0FBQztBQUlELHlCQUF5QixPQUErQixFQUFFLFFBQXVCO0lBQy9FLElBQU0sR0FBRyxHQUE0QixFQUFFLENBQUM7SUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBTSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFNLFFBQVEsR0FBd0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXZFLEVBQUUsQ0FBQyxDQUFDLG1CQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQztxQkFDdkUsTUFBTSxDQUFDLFVBQUMsRUFBMkIsSUFBSyxPQUFBLEVBQUUsS0FBSyxJQUFJLEVBQVgsQ0FBVyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQU0sRUFBRSxHQUFHLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVEO0lBQWlDLHVDQUFLO0lBS3BDLHFCQUFZLElBQWdCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsWUFBMkIsRUFBRSxNQUFjO1FBQWpILFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FJM0Q7UUFGQyxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQzs7SUFDOUUsQ0FBQztJQUVPLG1DQUFhLEdBQXJCLFVBQXNCLElBQWdCLEVBQUUsTUFBYyxFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUM3RixJQUFNLFFBQVEsR0FBWSxFQUFFLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVwRSxnQkFBZ0I7UUFDaEIsR0FBRyxDQUFDLENBQW1CLFVBQUcsRUFBSCxXQUFHLEVBQUgsaUJBQUcsRUFBSCxJQUFHO1lBQXJCLElBQU0sUUFBUSxZQUFBO1lBQ2pCLEdBQUcsQ0FBQyxDQUFzQixVQUFNLEVBQU4saUJBQU0sRUFBTixvQkFBTSxFQUFOLElBQU07Z0JBQTNCLElBQU0sV0FBVyxlQUFBO2dCQUNwQixJQUFNLE1BQUksR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxXQUFXLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBRXZGLElBQU0sV0FBVyxHQUFHO29CQUNsQixHQUFHLEVBQUUsUUFBUTtvQkFDYixNQUFNLEVBQUUsV0FBVztpQkFDcEIsQ0FBQztnQkFFRixRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsTUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQzFHO1NBQ0Y7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTSwrQkFBUyxHQUFoQjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQzFCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxxQ0FBZSxHQUF0QjtRQUNFLDZCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxvQ0FBYyxHQUFyQjtRQUFBLGlCQVdDO1FBVkMsbUVBQW1FO1FBQ25FLGlFQUFpRTtRQUNqRSxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dDQUNuQixLQUFLO1lBQ2QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLFdBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7Z0JBQzFDLEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUxELEdBQUcsQ0FBQyxDQUFnQixVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhO1lBQTVCLElBQU0sS0FBSyxTQUFBO29CQUFMLEtBQUs7U0FLZjtJQUNILENBQUM7SUFFTSxvQ0FBYyxHQUFyQjtRQUNFLEdBQUcsQ0FBQyxDQUFnQixVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhO1lBQTVCLElBQU0sS0FBSyxTQUFBO1lBQ2QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVNLHdDQUFrQixHQUF6QjtRQUNFLEdBQUcsQ0FBQyxDQUFnQixVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhO1lBQTVCLElBQU0sS0FBSyxTQUFBO1lBQ2QsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDNUI7UUFFRCxtQ0FBbUM7SUFDckMsQ0FBQztJQUVNLGlDQUFXLEdBQWxCO1FBQ0UsMEJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLGtDQUFZLEdBQW5CO1FBQ0csRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsQixpQ0FBaUM7WUFDakMsTUFBTSxDQUFDLHVCQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFTSxtREFBNkIsR0FBcEM7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHNEQUFnQyxHQUF2QyxVQUF3QyxPQUFjO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsRUFBRSxLQUFLLElBQUssT0FBQSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsRUFBRSxDQUFDLEVBQTFDLENBQTBDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVNLDhDQUF3QixHQUEvQjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEVBQWhDLENBQWdDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVNLDJDQUFxQixHQUE1QjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO1lBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFDdkQsQ0FBQyxFQUFFLGdDQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLDJDQUFxQixHQUE1QixVQUE2QixJQUFjO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsRUFBRSxLQUFLLElBQUssT0FBQSxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLEVBQS9CLENBQStCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQzFFLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDO0lBQ0osQ0FBQztJQUVNLG1DQUFhLEdBQXBCO1FBQ0UsMkJBQTJCO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7WUFFNUIsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFFMUQsTUFBTSxvQkFDSixJQUFJLEVBQUUsT0FBTyxFQUNiLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUN6QixDQUFDLFdBQVcsR0FBRztnQkFDaEIsTUFBTSxFQUFFO29CQUNOLE1BQU0sRUFBRSxXQUFXO2lCQUNwQjthQUNGLEdBQUcsRUFBRSxDQUFDLEVBQ0osS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUN4QjtRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXpJRCxDQUFpQyxhQUFLLEdBeUlyQztBQXpJWSxrQ0FBVyJ9