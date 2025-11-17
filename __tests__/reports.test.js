import { sumBy, groupBy, safeParseJSON } from '../utils/reports';

test('sumBy sums numeric fields', () => {
  const items = [{a:1},{a:2},{a:3}];
  expect(sumBy(items,'a')).toBe(6);
});

test('groupBy groups by key', () => {
  const items = [{k:'x'},{k:'y'},{k:'x'}];
  const g = groupBy(items,'k');
  expect(Object.keys(g).length).toBe(2);
  expect(g['x'].length).toBe(2);
});

test('safeParseJSON returns fallback on invalid', () => {
  expect(safeParseJSON('not json', null)).toBeNull();
});
