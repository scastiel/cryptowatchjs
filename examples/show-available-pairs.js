// @flow

const { fetchPairs } = require('..')

async function main () {
  try {
    const pairs = await fetchPairs()
    console.log(
      pairs
        .map(pair => `${pair.base.symbol} => ${pair.quote.symbol}`)
        .join('\n')
    )
  } catch (err) {
    console.error(err.stack)
  }
}

main()
