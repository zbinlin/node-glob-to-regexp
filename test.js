"use strict";

var assert = require("assert");
var globToRegExp = require("./index.js");

function assertMatch(glob, testStr, options) {
    assert.ok(globToRegExp(glob, options).test(testStr));
}

function assertNotMatch(glob, testStr, options) {
    assert.equal(globToRegExp(glob, options).test(testStr), false);
}

assertMatch("?", "a");
assertNotMatch("?", "aa", {
    wholeMatch: true,
});

assertMatch("*", "");
assertMatch("*", "a");
assertMatch("*", "aa");

assertMatch("[0-9]", "0");
assertNotMatch("[1-9]", "0");
assertMatch("[0-9]", "5");
assertMatch("[0-9]", "9");

assertMatch("[]-]", "]");
assertMatch("[]-]", "-");

assertMatch("[--0]", "-");
assertMatch("[--0]", ".");
assertMatch("[--0]", "0");

assertMatch("[!a]", "b");
assertNotMatch("[!a]", "a");

assertMatch("[][!]", "[");
assertMatch("[][!]", "]");
assertMatch("[][!]", "!");

assertMatch("[[?*\\\\]", "[");
assertMatch("[[?*\\\\]", "?");
assertMatch("[[?*\\\\]", "*");
assertMatch("[[?*\\\\]", "\\");


assertMatch("[]", "[]");

assertMatch("[]1-2]", "]");
assertMatch("[]1-2]", "1");
assertMatch("[]1-2]", "2");

assertMatch("{}", "{}");
assertMatch("{1}", "{1}");
assertMatch("{1,}", "1");

assertMatch("{1\\,}", "{1,}");

assertMatch("{1\\\\,2}", "1\\");
assertMatch("{1\\\\,2}", "2");

assertMatch("http{,s}://www.example.org", "http://www.example.org");
assertMatch("http{,s}://www.example.org", "https://www.example.org");

assertMatch("http{s,}://www.example.org", "http://www.example.org");
assertMatch("http{s,}://www.example.org", "https://www.example.org");

assertMatch("a{b,c,d}e", "abe");
assertMatch("a{b,c,d}e", "ace");
assertMatch("a{b,c,d}e", "ade");


// test case modify from https://github.com/fitzgen/glob-to-regexp/blob/master/test.js

// Match everything
assertMatch("*", "foo");
assertMatch("*", "foo", { wholeMatch: false });

// Match the end
assertMatch("f*", "foo");
assertMatch("f*", "foo", { wholeMatch: false });

// Match the start
assertMatch("*o", "foo");
assertMatch("*o", "foo", { wholeMatch: false });

// Match the middle
assertMatch("f*uck", "firetruck");
assertMatch("f*uck", "firetruck", { wholeMatch: false });

// Don't match with wholeMatch
assertNotMatch("uc", "firetruck");
// Match anywhere without wholeMatch
assertMatch("uc", "firetruck", { wholeMatch: false });

// Match zero characters
assertMatch("f*uck", "fuck");
assertMatch("f*uck", "fuck", { wholeMatch: false });

// More complex matches
assertMatch("*.min.js", "http://example.com/jquery.min.js");
assertMatch("*.min.*", "http://example.com/jquery.min.js");
assertMatch("*/js/*.js", "http://example.com/js/jquery.min.js");

// More complex matches without wholeMatch (complex regression)
assertMatch("*.min.*", "http://example.com/jquery.min.js", { wholeMatch: false });
assertMatch("*.min.js", "http://example.com/jquery.min.js", { wholeMatch: false });
assertMatch("*/js/*.js", "http://example.com/js/jquery.min.js", { wholeMatch: false });

var testStr = "/$^+?.()=!|{},[].*";
assertMatch(testStr, testStr);
assertMatch(testStr, testStr, { wholeMatch: false });

// Equivalent matches with/without wholeMatch
assertNotMatch(".min.", "http://example.com/jquery.min.js", { wholeMatch: true });
assertMatch("*.min.*", "http://example.com/jquery.min.js", { wholeMatch: true });
assertMatch(".min.", "http://example.com/jquery.min.js", { wholeMatch: false });

assertNotMatch("http:", "http://example.com/jquery.min.js");
assertMatch("http:*", "http://example.com/jquery.min.js");
assertMatch("http:", "http://example.com/jquery.min.js", { wholeMatch: false });

assertNotMatch("min.js", "http://example.com/jquery.min.js");
assertMatch("*.min.js", "http://example.com/jquery.min.js");
assertMatch("min.js", "http://example.com/jquery.min.js", { wholeMatch: false });

// Match anywhere
assertMatch("min", "http://example.com/jquery.min.js", { wholeMatch: false });
assertMatch("/js/", "http://example.com/js/jquery.min.js", { wholeMatch: false });

assertNotMatch("/js*jq*.js", "http://example.com/js/jquery.min.js");
assertMatch("/js*jq*.js", "http://example.com/js/jquery.min.js", { wholeMatch: false });

// Extended mode

// ?: Match one character, no more and no less
assertMatch("f?o", "foo", { extended: true });
assertNotMatch("f?o", "fooo", { extended: true });
assertNotMatch("f?oo", "foo", { extended: true });

// ?: Match one character without wholeMatch
assertMatch("f?o", "foo", { extended: true, wholeMatch: false });
assertMatch("f?o", "fooo", { extended: true, wholeMatch: false });
assertMatch("f?o?", "fooo", { extended: true, wholeMatch: false });
assertNotMatch("?fo", "fooo", { extended: true, wholeMatch: false });
assertNotMatch("f?oo", "foo", { extended: true, wholeMatch: false });
assertNotMatch("foo?", "foo", { extended: true, wholeMatch: false });

// []: Match a character range
assertMatch("fo[oz]", "foo", { extended: true });
assertMatch("fo[oz]", "foz", { extended: true });
assertNotMatch("fo[oz]", "fog", { extended: true });

// []: Match a character range and without wholeMatch
assertMatch("fo[oz]", "foo", { extended: true, wholeMatch: false });
assertMatch("fo[oz]", "foz", { extended: true, wholeMatch: false });
assertNotMatch("fo[oz]", "fog", { extended: true, wholeMatch: false });

// {}: Match a choice of different substrings
assertMatch("foo{bar,baaz}", "foobaaz", { extended: true });
assertMatch("foo{bar,baaz}", "foobar", { extended: true });
assertNotMatch("foo{bar,baaz}", "foobuzz", { extended: true });
assertMatch("foo{bar,b*z}", "foobuzz", { extended: true });

// {}: Match a choice of different substrings and without wholeMatch
assertMatch("foo{bar,baaz}", "foobaaz", { extended: true, wholeMatch: false });
assertMatch("foo{bar,baaz}", "foobar", { extended: true, wholeMatch: false });
assertNotMatch("foo{bar,baaz}", "foobuzz", { extended: true, wholeMatch: false });
assertMatch("foo{bar,b*z}", "foobuzz", { extended: true, wholeMatch: false });

// More complex extended matches
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://foo.baaz.com/jquery.min.js",
            { extended: true });
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://moz.buzz.com/index.html",
            { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.buzz.com/index.htm",
               { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.bar.com/index.html",
               { extended: true });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://flozz.buzz.com/index.html",
               { extended: true });

// More complex extended matches and without wholeMatch
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://foo.baaz.com/jquery.min.js",
            { extended: true, wholeMatch: false });
assertMatch("http://?o[oz].b*z.com/{*.js,*.html}",
            "http://moz.buzz.com/index.html",
            { extended: true, wholeMatch: false });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.buzz.com/index.htm",
               { extended: true, wholeMatch: false });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://moz.bar.com/index.html",
               { extended: true, wholeMatch: false });
assertNotMatch("http://?o[oz].b*z.com/{*.js,*.html}",
               "http://flozz.buzz.com/index.html",
               { extended: true, wholeMatch: false });

// Remaining special chars should still match themselves
var testExtStr = "/$^+.()=!|,.";
assertMatch(testExtStr, testExtStr, { extended: true });
assertMatch(testExtStr, testExtStr, { extended: true, wholeMatch: false });

console.log("ok\n");
