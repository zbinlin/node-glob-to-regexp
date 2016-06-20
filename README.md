# glob2regexp

Convert glob string to RegExp object


## Usage

```javascript
var globToRegExp = require("glob2regexp");
console.log(
	globToRegExp("http?://www.example.org").test("https://www.example.org")
); // true
console.log(
	globToRegExp("http{s,}://www.example.org").test("http://www.example.org")
); // true
console.log(
	globToRegExp("http{s,}://www.example.org").test("https://www.example.org")
); // true


// match a signle character
globToRegExp("?").test("a"); // true

// match any characters
globToRegExp("*").test(""); // true, match empty character
globToRegExp("*").test("a"); // true, match a signle character
globToRegExp("*").test("aa"); // true, match multiple characters


// also supports range match
globToRegExp("[0-9]").test("0"); // true
globToRegExp("[a-z]").test("z"); // true


// and supports brace-expansion
globToRegExp("{1,2}").test("1"); // true
globToRegExp("{1,2}").test("2"); // true
globToRegExp("{1,2}").test("3"); // false
globToRegExp("{,1}").test(""); // true
globToRegExp("{,1}").test("1"); // true
```
