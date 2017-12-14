#!/usr/bin/env node

// @flow

const program = require('commander')
const table = require('text-table')
const packageJson = require('../package.json')
const { fetchPairs, fetchAveragePrices } = require('..')

const NB_SIGNIFICANT_DIGITS_IN_AMOUNTS = 3

function formatPrice (number, nbSignificantDigits) {
  return number.toLocaleString(undefined, {
    minimumSignificantDigits: nbSignificantDigits,
    maximumSignificantDigits: nbSignificantDigits
  })
}

const getRowForPair = (prices, pairs) => pairSymbol => {
  const [baseAssetSymbol, ...quoteAssetsSymbol] = pairSymbol.split('-')
  const row = ['1', baseAssetSymbol.toUpperCase()]
  quoteAssetsSymbol.forEach(quoteAssetSymbol => {
    const pair = pairs.find(
      pair =>
        pair.base.symbol === baseAssetSymbol &&
        pair.quote.symbol === quoteAssetSymbol
    )
    if (pair) {
      const price = prices[pair.symbol]
      const formattedPrice =
        price !== undefined
          ? formatPrice(price, NB_SIGNIFICANT_DIGITS_IN_AMOUNTS)
          : '?'
      row.push('=', formattedPrice, quoteAssetSymbol.toUpperCase())
    }
  })
  return row
}

async function main () {
  program
    .version(packageJson.version)
    .usage('<pairs...>')
    .parse(process.argv)
  const pairSymbols = program.args

  const pairs = await fetchPairs()
  const prices = await fetchAveragePrices()

  const rows = pairSymbols.map(getRowForPair(prices, pairs))
  const maxRowLength = rows.reduce((max, row) => Math.max(max, row.length), 0)
  const align = [...Array(maxRowLength)].map(
    (val, index) => (index > 0 && index % 3 === 0 ? 'r' : 'l')
  )
  console.log(table(rows, { align, hsep: ' ' }))
}

main().then(() => {}, err => console.error(err))
