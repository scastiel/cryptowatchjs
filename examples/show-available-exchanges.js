// @flow

const { fetchExchanges } = require('..')

async function main () {
  try {
    const exchanges = await fetchExchanges()
    console.log(
      exchanges
        .map(exchange => `${exchange.name} (${exchange.symbol})`)
        .join('\n')
    )
  } catch (err) {
    console.error(err.stack)
  }
}

main()
