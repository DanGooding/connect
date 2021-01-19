
import React from 'react';

export type WallSymbolName = 'alpha'|'beta'|'lion'|'water';

const symbolChars = new Map<WallSymbolName, string>([
  ['alpha', 'α'],
  ['beta',  'β'],
  ['lion',  '🦁'],
  ['water', '🌊']
]);

type WallSymbolProps = {
  symbolName: WallSymbolName
};

function WallSymbol({symbolName}: WallSymbolProps) {
  return (
    <span role="img" aria-label={symbolName} title={symbolName}>
      {symbolChars.get(symbolName)}
    </span>
  );
}

export default WallSymbol;
