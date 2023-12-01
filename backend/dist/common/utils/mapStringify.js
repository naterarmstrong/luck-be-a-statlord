"use strict";
// From: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviver = exports.replacer = void 0;
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    }
    else {
        return value;
    }
}
exports.replacer = replacer;
function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
exports.reviver = reviver;
