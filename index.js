exports.onHandleCode = function onHandleCode(ev) {
  let varCount = -1;

  ev.data.code = ev.data.code
    .replace(/module\s*\.\s*exports\s*=\s*{\s*([\s\S]*?)\s*}\s*;/gm,
      (str, exports) => {
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
      (str, a, b, c) => {
        const next = c.substring(0, 1);
        if (next === '.' || next === '(') {
          return 'import ' + a + ' from ' + b + '; ' + a + c;
        }
        return 'import ' + a + ' from ' + b + c;
      })
    .replace(/^(?:const|var|let)\s*(\{(?:[\s\S]*?)\})\s*=\s*require\s*\(\s*(.*?)\s*\)/gm,
      (str, a, b) => {
        if (/{(\s*\w+\s*,){0,}\s*(\w+)\s*:\s*(\w+)\s*(,\s*(\w+)\s*:\s*(\w+)\s*){0,}(,\s*\w+\s*){0,}}/gm.test(a)) {
          const [full] = a.match(/{(\s*\w+\s*,){0,}\s*(\w+)\s*:\s*(\w+)\s*(,\s*(\w+)\s*:\s*(\w+)\s*){0,}(,\s*\w+\s*){0,}}/s);
          return `import ${full.replace(/:/gm, ' as ')} from ${b}`;
        }
        const hash = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
        return `import * as ${hash} from ${b}; \nconst ${a} = ${hash}`;
      })
    .replace(/^require\s*\(\s*(.*?)\s*\)(.*?)$/gm,
      (str, a, b) => {
        const next = b.substring(0, 1);
        if (next === '.' || next === '(') {
          varCount++;
          return 'import ESDOC_NODE_VAR_' + varCount + ' from ' + a + '; ESDOC_NODE_VAR_' + varCount + b;
        }
        return 'import ' + a + b;
      });
};
