// @flow

const { fetchPairDetails } = require('..')

async function main () {
  try {
    const pair = await fetchPairDetails('btcusd')
    if (pair.markets) {
      console.log(pair.markets.map(market => market.exchange).join('\n'))
    }
  } catch (err) {
    console.error(err.stack)
  }
}

main()
