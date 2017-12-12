// @flow

const { fetchAssetDetails } = require('..')

function getExchangesByPairFromMarkets (markets) {
  return markets.reduce(
    (acc, market) => ({
      ...acc,
      [market.pair]: acc[market.pair]
        ? [...acc[market.pair], market.exchange]
        : [market.exchange]
    }),
    {}
  )
}

function logExchangesByPair (exchangesByPair) {
  console.log(
    Object.keys(exchangesByPair)
      .map(pair => `${pair}: ${exchangesByPair[pair].join(', ')}`)
      .join('\n')
  )
}

async function main () {
  try {
    const bitcoin = await fetchAssetDetails('btc')
    if (bitcoin.markets) {
      const baseMarkets = bitcoin.markets.base
      const exchangesByPair = getExchangesByPairFromMarkets(baseMarkets)
      logExchangesByPair(exchangesByPair)
    }
  } catch (err) {
    console.error(err.stack)
  }
}

main()
