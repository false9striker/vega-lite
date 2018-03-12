"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
exports.HEADER_CHANNELS = ['row', 'column'];
exports.HEADER_TYPES = ['header', 'footer'];
function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left') {
        return 'header';
    }
    return 'footer';
}
exports.getHeaderType = getHeaderType;
function getTitleGroup(model, channel) {
    var title = model.component.layoutHeaders[channel].title;
    var textOrient = channel === 'row' ? 'vertical' : undefined;
    var update = __assign({ align: { value: 'center' }, text: { value: title } }, (textOrient === 'vertical' ? { angle: { value: 270 } } : {}));
    return {
        name: model.getName(channel + "_title"),
        role: channel + "-title",
        type: 'group',
        marks: [__assign({ type: 'text', role: channel + "-title-text", style: 'guide-title' }, (util_1.keys(update).length > 0 ? { encode: { update: update } } : {}))]
    };
}
exports.getTitleGroup = getTitleGroup;
function getHeaderGroups(model, channel) {
    var layoutHeader = model.component.layoutHeaders[channel];
    var groups = [];
    for (var _i = 0, HEADER_TYPES_1 = exports.HEADER_TYPES; _i < HEADER_TYPES_1.length; _i++) {
        var headerType = HEADER_TYPES_1[_i];
        if (layoutHeader[headerType]) {
            for (var _a = 0, _b = layoutHeader[headerType]; _a < _b.length; _a++) {
                var headerCmpt = _b[_a];
                groups.push(getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt));
            }
        }
    }
    return groups;
}
exports.getHeaderGroups = getHeaderGroups;
// 0, (0,90), 90, (90, 180), 180, (180, 270), 270, (270, 0)
function labelAlign(angle) {
    // to keep angle in [0, 360)
    angle = ((angle % 360) + 360) % 360;
    if ((angle + 90) % 180 === 0) {
        return {}; // default center
    }
    else if (angle < 90 || 270 < angle) {
        return { align: { value: 'right' } };
    }
    else if (135 <= angle && angle < 225) {
        return { align: { value: 'left' } };
    }
    return {};
}
exports.labelAlign = labelAlign;
function labelBaseline(angle) {
    // to keep angle in [0, 360)
    angle = ((angle % 360) + 360) % 360;
    if (45 <= angle && angle <= 135) {
        return { baseline: { value: 'top' } };
    }
    return {};
}
exports.labelBaseline = labelBaseline;
function getHeaderGroup(model, channel, headerType, layoutHeader, headerCmpt) {
    if (headerCmpt) {
        var title = null;
        var facetFieldDef = layoutHeader.facetFieldDef;
        if (facetFieldDef && headerCmpt.labels) {
            var _a = facetFieldDef.header, header = _a === void 0 ? {} : _a;
            var format = header.format, labelAngle = header.labelAngle;
            var update = __assign({}, (labelAngle !== undefined ? { angle: { value: labelAngle } } : {}), labelAlign(labelAngle), labelBaseline(labelAngle));
            title = __assign({ text: common_1.formatSignalRef(facetFieldDef, format, 'parent', model.config), offset: 10, orient: channel === 'row' ? 'left' : 'top', style: 'guide-label' }, (util_1.keys(update).length > 0 ? { encode: { update: update } } : {}));
        }
        var axes = headerCmpt.axes;
        var hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            var sizeChannel = channel === 'row' ? 'height' : 'width';
            return __assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.facetFieldDef ? {
                from: { data: model.getName(channel + '_domain') },
                sort: {
                    field: fielddef_1.vgField(facetFieldDef, { expr: 'datum' }),
                    order: facetFieldDef.sort || 'ascending'
                }
            } : {}), (title ? { title: title } : {}), (headerCmpt.sizeSignal ? {
                encode: {
                    update: (_b = {},
                        _b[sizeChannel] = headerCmpt.sizeSignal,
                        _b)
                }
            } : {}), (hasAxes ? { axes: axes } : {}));
        }
    }
    return null;
    var _b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsMkNBQXVDO0FBQ3ZDLG1DQUFnQztBQUVoQyxvQ0FBMEM7QUFJN0IsUUFBQSxlQUFlLEdBQW9CLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBR3JELFFBQUEsWUFBWSxHQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQXdDL0QsdUJBQThCLE1BQWtCO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBTEQsc0NBS0M7QUFFRCx1QkFBOEIsS0FBWSxFQUFFLE9BQXNCO0lBQ2hFLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMzRCxJQUFNLFVBQVUsR0FBRyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUU5RCxJQUFNLE1BQU0sY0FDVixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQ3hCLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsSUFDakIsQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFBQyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FHM0QsQ0FBQztJQUVGLE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRyxLQUFLLENBQUMsT0FB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Ii8qKlxuICogVXRpbGl0eSBmb3IgZ2VuZXJhdGluZyByb3cgLyBjb2x1bW4gaGVhZGVyc1xuICovXG5pbXBvcnQge0ZhY2V0RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZhY2V0JztcbmltcG9ydCB7dmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7QXhpc09yaWVudCwgVmdBeGlzLCBWZ01hcmtHcm91cH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtmb3JtYXRTaWduYWxSZWZ9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5cbmV4cG9ydCB0eXBlIEhlYWRlckNoYW5uZWwgPSAncm93JyB8ICdjb2x1bW4nO1xuZXhwb3J0IGNvbnN0IEhFQURFUl9DSEFOTkVMUzogSGVhZGVyQ2hhbm5lbFtdID0gWydyb3cnLCAnY29sdW1uJ107XG5cbmV4cG9ydCB0eXBlIEhlYWRlclR5cGUgPSAnaGVhZGVyJyB8ICdmb290ZXInO1xuZXhwb3J0IGNvbnN0IEhFQURFUl9UWVBFUzogSGVhZGVyVHlwZVtdID0gWydoZWFkZXInLCAnZm9vdGVyJ107XG5cbi8qKlxuICogQSBjb21wb25lbnQgdGhhdCByZXByZXNlbnRzIGFsbCBoZWFkZXIsIGZvb3RlcnMgYW5kIHRpdGxlIG9mIGEgVmVnYSBncm91cCB3aXRoIGxheW91dCBkaXJlY3RpdmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF5b3V0SGVhZGVyQ29tcG9uZW50IHtcbiAgdGl0bGU/OiBzdHJpbmc7XG5cbiAgLy8gVE9ETzogcmVwZWF0IGFuZCBjb25jYXQgY2FuIGhhdmUgbXVsdGlwbGUgaGVhZGVyIC8gZm9vdGVyLlxuICAvLyBOZWVkIHRvIHJlZGVzaWduIHRoaXMgcGFydCBhIGJpdC5cblxuICBmYWNldEZpZWxkRGVmPzogRmFjZXRGaWVsZERlZjxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBoZWFkZXIgY29tcG9uZW50cyBmb3IgaGVhZGVycy5cbiAgICogRm9yIGZhY2V0LCB0aGVyZSBzaG91bGQgYmUgb25seSBvbmUgaGVhZGVyIGNvbXBvbmVudCwgd2hpY2ggaXMgZGF0YS1kcml2ZW4uXG4gICAqIEZvciByZXBlYXQgYW5kIGNvbmNhdCwgdGhlcmUgY2FuIGJlIG11bHRpcGxlIGhlYWRlciBjb21wb25lbnRzIHRoYXQgZXhwbGljaXRseSBsaXN0IGRpZmZlcmVudCBheGVzLlxuICAgKi9cbiAgaGVhZGVyPzogSGVhZGVyQ29tcG9uZW50W107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGhlYWRlciBjb21wb25lbnRzIGZvciBmb290ZXJzLlxuICAgKiBGb3IgZmFjZXQsIHRoZXJlIHNob3VsZCBiZSBvbmx5IG9uZSBoZWFkZXIgY29tcG9uZW50LCB3aGljaCBpcyBkYXRhLWRyaXZlbi5cbiAgICogRm9yIHJlcGVhdCBhbmQgY29uY2F0LCB0aGVyZSBjYW4gYmUgbXVsdGlwbGUgaGVhZGVyIGNvbXBvbmVudHMgdGhhdCBleHBsaWNpdGx5IGxpc3QgZGlmZmVyZW50IGF4ZXMuXG4gICAqL1xuICBmb290ZXI/OiBIZWFkZXJDb21wb25lbnRbXTtcbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudHMgb25lIGdyb3VwIG9mIHJvdy9jb2x1bW4taGVhZGVyL2Zvb3Rlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIZWFkZXJDb21wb25lbnQge1xuXG4gIGxhYmVsczogYm9vbGVhbjtcblxuICBzaXplU2lnbmFsOiB7c2lnbmFsOiBzdHJpbmd9O1xuXG4gIGF4ZXM6IFZnQXhpc1tdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVyVHlwZShvcmllbnQ6IEF4aXNPcmllbnQpIHtcbiAgaWYgKG9yaWVudCA9PT0gJ3RvcCcgfHwgb3JpZW50ID09PSAnbGVmdCcpIHtcbiAgICByZXR1cm4gJ2hlYWRlcic7XG4gIH1cbiAgcmV0dXJuICdmb290ZXInO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGl0bGVHcm91cChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IEhlYWRlckNoYW5uZWwpIHtcbiAgY29uc3QgdGl0bGUgPSBtb2RlbC5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZTtcbiAgY29uc3QgdGV4dE9yaWVudCA9IGNoYW5uZWwgPT09ICdyb3cnID8gJ3ZlcnRpY2FsJyA6IHVuZGVmaW5lZDtcblxuICBjb25zdCB1cGRhdGUgPSB7XG4gICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9LFxuICAgIHRleHQ6IHt2YWx1ZTogdGl0bGV9LFxuICAgIC4uLih0ZXh0T3JpZW50ID09PSAndmVydGljYWwnID8ge2FuZ2xlOiB7dmFsdWU6IDI3MH19OiB7fSksXG4gICAgLy8gVE9ETypodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI0NDYpOiBhZGQgdGl0bGUqIHByb3BlcnRpZXMgKGUuZy4sIHRpdGxlQWxpZ24pXG4gICAgLy8gYWxzbyBtYWtlIHN1cmUgdGhhdCBndWlkZS10aXRsZSBjb25maWcgb3ZlcnJpZGUgdGhlc2UgVmVnYS1saXRlIGRlZmF1bHRcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICBtb2RlbC5nZXROYW1lKGAke2NoYW5uZWx9X3RpdGxlYCksXG4gICAgcm9sZTogYCR7Y2hhbm5lbH0tdGl0bGVgLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgbWFya3M6IFt7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICByb2xlOiBgJHtjaGFubmVsfS10aXRsZS10ZXh0YCxcbiAgICAgIHN0eWxlOiAnZ3VpZGUtdGl0bGUnLFxuICAgICAgLi4uKGtleXModXBkYXRlKS5sZW5ndGggPiAwID8ge2VuY29kZToge3VwZGF0ZX19IDoge30pXG4gICAgfV1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRlckdyb3Vwcyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IEhlYWRlckNoYW5uZWwpOiBWZ01hcmtHcm91cFtdIHtcbiAgY29uc3QgbGF5b3V0SGVhZGVyID0gbW9kZWwuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF07XG4gIGNvbnN0IGdyb3VwcyA9IFtdO1xuICBmb3IgKGNvbnN0IGhlYWRlclR5cGUgb2YgSEVBREVSX1RZUEVTKSB7XG4gICAgaWYgKGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSkge1xuICAgICAgZm9yIChjb25zdCBoZWFkZXJDbXB0IG9mIGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSkge1xuICAgICAgICBncm91cHMucHVzaChnZXRIZWFkZXJHcm91cChtb2RlbCwgY2hhbm5lbCwgaGVhZGVyVHlwZSwgbGF5b3V0SGVhZGVyLCBoZWFkZXJDbXB0KSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBncm91cHM7XG59XG5cbi8vIDAsICgwLDkwKSwgOTAsICg5MCwgMTgwKSwgMTgwLCAoMTgwLCAyNzApLCAyNzAsICgyNzAsIDApXG5cbmV4cG9ydCBmdW5jdGlvbiBsYWJlbEFsaWduKGFuZ2xlOiBudW1iZXIpIHtcbiAgLy8gdG8ga2VlcCBhbmdsZSBpbiBbMCwgMzYwKVxuICBhbmdsZSA9ICgoYW5nbGUgJSAzNjApICsgMzYwKSAlIDM2MDtcbiAgaWYgKChhbmdsZSArIDkwKSAlIDE4MCA9PT0gMCkgeyAgLy8gZm9yIDkwIGFuZCAyNzBcbiAgICByZXR1cm4ge307IC8vIGRlZmF1bHQgY2VudGVyXG4gIH0gZWxzZSBpZiAoYW5nbGUgPCA5MCB8fCAyNzAgPCBhbmdsZSkge1xuICAgIHJldHVybiB7YWxpZ246IHt2YWx1ZTogJ3JpZ2h0J319O1xuICB9IGVsc2UgaWYgKDEzNSA8PSBhbmdsZSAmJiBhbmdsZSA8IDIyNSkge1xuICAgIHJldHVybiB7YWxpZ246IHt2YWx1ZTogJ2xlZnQnfX07XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWxCYXNlbGluZShhbmdsZTogbnVtYmVyKSB7XG4gIC8vIHRvIGtlZXAgYW5nbGUgaW4gWzAsIDM2MClcbiAgYW5nbGUgPSAoKGFuZ2xlICUgMzYwKSArIDM2MCkgJSAzNjA7XG4gIGlmICg0NSA8PSBhbmdsZSAmJiBhbmdsZSA8PSAxMzUpIHtcbiAgICByZXR1cm4ge2Jhc2VsaW5lOiB7dmFsdWU6ICd0b3AnfX07XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiBnZXRIZWFkZXJHcm91cChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IEhlYWRlckNoYW5uZWwsIGhlYWRlclR5cGU6IEhlYWRlclR5cGUsIGxheW91dEhlYWRlcjogTGF5b3V0SGVhZGVyQ29tcG9uZW50LCBoZWFkZXJDbXB0OiBIZWFkZXJDb21wb25lbnQpIHtcbiAgaWYgKGhlYWRlckNtcHQpIHtcbiAgICBsZXQgdGl0bGUgPSBudWxsO1xuICAgIGNvbnN0IHtmYWNldEZpZWxkRGVmfSA9IGxheW91dEhlYWRlcjtcbiAgICBpZiAoZmFjZXRGaWVsZERlZiAmJiBoZWFkZXJDbXB0LmxhYmVscykge1xuICAgICAgY29uc3Qge2hlYWRlciA9IHt9fSA9IGZhY2V0RmllbGREZWY7XG4gICAgICBjb25zdCB7Zm9ybWF0LCBsYWJlbEFuZ2xlfSA9IGhlYWRlcjtcblxuICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAuLi4oXG4gICAgICAgICAgbGFiZWxBbmdsZSAhPT0gdW5kZWZpbmVkID8ge2FuZ2xlOiB7dmFsdWU6IGxhYmVsQW5nbGV9fSA6IHt9XG4gICAgICAgICksXG4gICAgICAgIC4uLmxhYmVsQWxpZ24obGFiZWxBbmdsZSksXG4gICAgICAgIC4uLmxhYmVsQmFzZWxpbmUobGFiZWxBbmdsZSlcblxuICAgICAgfTtcblxuICAgICAgdGl0bGUgPSB7XG4gICAgICAgIHRleHQ6IGZvcm1hdFNpZ25hbFJlZihmYWNldEZpZWxkRGVmLCBmb3JtYXQsICdwYXJlbnQnLCBtb2RlbC5jb25maWcpLFxuICAgICAgICBvZmZzZXQ6IDEwLFxuICAgICAgICBvcmllbnQ6IGNoYW5uZWwgPT09ICdyb3cnID8gJ2xlZnQnIDogJ3RvcCcsXG4gICAgICAgIHN0eWxlOiAnZ3VpZGUtbGFiZWwnLFxuICAgICAgICAuLi4oa2V5cyh1cGRhdGUpLmxlbmd0aCA+IDAgPyB7ZW5jb2RlOiB7dXBkYXRlfX0gOiB7fSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgYXhlcyA9IGhlYWRlckNtcHQuYXhlcztcblxuICAgIGNvbnN0IGhhc0F4ZXMgPSBheGVzICYmIGF4ZXMubGVuZ3RoID4gMDtcbiAgICBpZiAodGl0bGUgfHwgaGFzQXhlcykge1xuICAgICAgY29uc3Qgc2l6ZUNoYW5uZWwgPSBjaGFubmVsID09PSAncm93JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbW9kZWwuZ2V0TmFtZShgJHtjaGFubmVsfV8ke2hlYWRlclR5cGV9YCksXG4gICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgIHJvbGU6IGAke2NoYW5uZWx9LSR7aGVhZGVyVHlwZX1gLFxuICAgICAgICAuLi4obGF5b3V0SGVhZGVyLmZhY2V0RmllbGREZWYgPyB7XG4gICAgICAgICAgZnJvbToge2RhdGE6IG1vZGVsLmdldE5hbWUoY2hhbm5lbCArICdfZG9tYWluJyl9LFxuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIGZpZWxkOiB2Z0ZpZWxkKGZhY2V0RmllbGREZWYsIHtleHByOiAnZGF0dW0nfSksXG4gICAgICAgICAgICBvcmRlcjogZmFjZXRGaWVsZERlZi5zb3J0IHx8ICdhc2NlbmRpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9IDoge30pLFxuICAgICAgICAuLi4odGl0bGUgPyB7dGl0bGV9IDoge30pLFxuICAgICAgICAuLi4oaGVhZGVyQ21wdC5zaXplU2lnbmFsID8ge1xuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIFtzaXplQ2hhbm5lbF06IGhlYWRlckNtcHQuc2l6ZVNpZ25hbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfToge30pLFxuICAgICAgICAuLi4oaGFzQXhlcyA/IHtheGVzfSA6IHt9KVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=