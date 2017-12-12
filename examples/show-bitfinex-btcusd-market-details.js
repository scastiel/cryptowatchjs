// @flow

const {
  fetchMarketDetails,
  fetchMarketPrice,
  fetchMarketSummary,
  fetchMarketOrderBook,
  fetchMarketTrades,
  fetchMarketOHLC
} = require('..')

async function main () {
  try {
    console.log(await fetchMarketDetails('bitfinex', 'btcusd'))
    console.log(await fetchMarketPrice('bitfinex', 'btcusd'))
    console.log(await fetchMarketSummary('bitfinex', 'btcusd'))
    console.log(await fetchMarketOrderBook('bitfinex', 'btcusd'))
    console.log(await fetchMarketTrades('bitfinex', 'btcusd'))
    console.log(await fetchMarketOHLC('bitfinex', 'btcusd'))
  } catch (err) {
    console.error(err.stack)
  }
}

main()
