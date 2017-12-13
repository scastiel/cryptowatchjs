// @flow

const {
  fetchPricesByPair,
  fetchPricesByExchange,
  fetchAveragePrices
} = require('..')

async function main () {
  try {
    console.log(await fetchPricesByPair())
    console.log(await fetchPricesByExchange())
    console.log(await fetchAveragePrices())
  } catch (err) {
    console.error(err.stack)
  }
}

main()
