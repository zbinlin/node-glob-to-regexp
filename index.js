"use strict";

/**
 * convert glob string to RegExp object
 * @param {string} glob - glob string
 * @param {Object} [options]
 * @param {boolean} [options.ignoreCase=false] - ignore case
 * @param {boolean} [options.wholeMatch=true] - match to whole string
 * @param {string} [options.flags] - used to new RegExp
 * @return {RegExp}
 */
module.exports = function globToRegExp(glob, options) {
    if (glob == null) {
        return /(?!)/; // does not match any character
    }
    var globStr = String(glob);
    if (globStr === "") {
        return /^$/; // match empty character
    }

    if (!options || typeof options !== "object") {
        options = {};
    }
    var ignoreCase = !!options.ignoreCase;
    var wholeMatch = "wholeMatch" in options ? !!options.wholeMatch : true; // default is match whole string
    var flags = "flags" in options ? String(options.flags) : "";
    if (ignoreCase && flags.indexOf("i") === -1) {
        flags += "i";
    }

    var regexpStr = "";
    var len = globStr.length;
    var pos = 0;
    var escapeChar = "\\";
    while (pos < len) {
        var ch = globStr[pos];
        switch (ch) {
            case "\\":
                pos += 1;
                regexpStr += ch + (pos < len ? globStr[pos] : "");
                break;

            case "$":
            case "(":
            case ")":
            case "+":
            case ".":
            case "/":
            case "^":
            case "|":
                regexpStr += escapeChar + ch;
                break;

            case "[":
                pos = matchInBrackets(globStr, pos);
                break;
            case "]":
                regexpStr += escapeChar + ch;
                break;

            case "{":
                pos = matchInBraces(globStr, pos);
                break;

            case "*":
                regexpStr += "[\\s\\S]*";
                break;

            case "?":
                regexpStr += "[\\s\\S]";
                break;

            default:
                regexpStr += ch;
        }
        pos += 1;
    }

    if (wholeMatch) {
        regexpStr = "^" + regexpStr + "$";
    }
    return new RegExp(regexpStr, flags);

    function matchInBrackets(str, start) {
        var pos = start + 1;
        var len = str.length;
        var matched = "";
        while (pos < len) {
            var ch = str[pos];
            switch (ch) {
                case "\\":
                    pos += 1;
                    matched += ch + (pos < len ? str[pos] : "");
                    break;
                case "]":
                    if (matched === "") {
                        matched = escapeChar + ch;
                        break;
                    }
                    if (matched === "!" || matched === "^") {
                        matched = escapeChar + str[start + 1];
                    }
                    regexpStr += str[start] + matched + ch;
                    return pos;
                case "!":
                    if (matched.length === 0) {
                        matched += "^";
                    } else {
                        matched += ch;
                    }
                    break;
                default:
                    matched += ch;
            }
            pos += 1;
        }
        matched = start[start + 1] === "]" ? (escapeChar + "]") : "";
        regexpStr += escapeChar + str[start] + matched;
        return start + matched.length;
    }
    function matchInBraces(str, start) {
        var  pos = start + 1;
        var len = str.length;
        var matched = "";
        var expanded = false;
        var ary = [];
        while (pos < len) {
            var ch = str[pos];
            switch (ch) {
                case "\\":
                    pos += 1;
                    matched += ch + (pos < len ? str[pos] : "");
                    break;
                case "}":
                    if (expanded) {
                        if (matched.length || str[pos - 1] === ",") {
                            ary.push(matched);
                        }
                        regexpStr += "(?:" + ary.join("|") + ")";
                        return pos;
                    } else {
                        regexpStr += escapeChar + "{" + matched + escapeChar + "}";
                        return pos;
                    }
                case ",":
                    expanded = true;
                    ary.push(matched);
                    matched = "";
                    break;
                case "*":
                    matched += "[\\s\\S]*";
                    break;
                case "?":
                    matched += "[\\s\\S]";
                    break;
                default:
                    matched += ch;
            }
            pos += 1;
        }
        regexpStr += escapeChar + "{";
        return start;
    }
};
