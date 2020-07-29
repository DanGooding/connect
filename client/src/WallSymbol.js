
import React from 'react';
import PropTypes from 'prop-types';

const symbolChars = {
  'alpha': 'α',
  'beta':  'β',
  'lion': '🦁',
  'water': '🌊'
};

function WallSymbol({symbol}) {
  return <span role="img" aria-label={symbol} title={symbol}>{symbolChars[symbol]}</span>
}

WallSymbol.propTypes = {
  symbol: PropTypes.oneOf(['alpha', 'beta', 'lion', 'water'])
};

export default WallSymbol;
