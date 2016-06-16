'use strict';

let test = require('tape');
let code = require('./index').onHandleCode;

let f = s => {
  let ev = {data: {code: s}};
  code(ev);
  return ev.data.code;
};

test('export default', t => {
  t.plan(1);
  t.equals(f('module . exports = hello;'),
           'export default hello;');
});

test('export class|function', t => {
  t.plan(2);
  t.equals(f('exports . Hello = class Hello {};'),
           'export class Hello {};');
  t.equals(f('exports . world = function world () {};'),
           'export function world () {};');
});

test('export { named };', t => {
  t.plan(1);
  t.equals(f('exports . some = some;'),
           'export { some };');
});

test('export let', t => {
  t.plan(1);
  t.equals(f('exports . hello = "world";'),
           'export let hello = "world";');
});
