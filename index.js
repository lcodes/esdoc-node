'use strict';

exports.onHandleCode = function onHandleCode(ev) {
  var varCount = -1;

  ev.data.code = ev.data.code
    .replace(/module\s*\.\s*exports\s*=\s*{\s*([\s\S]*?)\s*}\s*;/gm,
      function(str, exports) {
        return 'export { ' +
            exports.replace(/(\w+)\s*:\s*(\w+)\s*/g, '$2 as $1') +
              ' };';
      })
    .replace(/module\s*\.\s*exports\s*=\s?/g,
      'export default ')
    .replace(/exports\s*\.\s*([_\d\w]+)\s*=\s*(class|function\*?)\s+\1/g,
      'export $2 $1')
    .replace(/exports\s*\.\s*([_\d\w]+)\s*=\s*\1\s*;/g,
      'export { $1 };')
    .replace(/exports\s*\.\s*([_\d\w]+)\s*=/g,
      'export let $1 =')
    .replace(/^(?:const|var|let)\s(\w+)\s*=\s*require\s*\(\s*(.*?)\s*\)(.*?)$/gm,
      function(str, a, b, c) {
        var next = c.substring(0, 1);
        if (next === '.' || next === '(') {
          return 'import ' + a + ' from ' + b + '; ' + a + c;
        }
        return 'import ' + a + ' from ' + b + c;
      })
    .replace(/^(?:const|var|let)\s*(\{(?:[\s\S]*?)\})\s*=\s*require\s*\(\s*(.*?)\s*\)/gm,
      (str, a, b) => {
      // test case -  const {name:other/name} = require('name');
        if (/{\s*(\w+):\s*(\w+)\s*}/gm.test(a)) {
          const [full, key, value] = a.match(/{\s*(\w+):\s*(\w+)\s*}/s);
          return `import ${key} as ${value} from ${b}`;
        }
        // test case -  const {name} = require('name');
        if (/{\s*\w+\s*}/s.test(a)) {
          const [full] = a.match(/{\s*\w+\s*}/s);
          return `import ${full} from ${b}`;
        }
      })
    .replace(/^require\s*\(\s*(.*?)\s*\)(.*?)$/gm,
      function(str, a, b) {
        var next = b.substring(0, 1);
        if (next === '.' || next === '(') {
          varCount++;
          return 'import ESDOC_NODE_VAR_' + varCount + ' from ' + a + '; ESDOC_NODE_VAR_' + varCount + b;
        }
        return 'import ' + a + b;
      });
};
