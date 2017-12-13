// @flow

const { returnResultFromUrl } = require('./helpers')

type id = number

type url = string

type market = {
  id: ?id,
  exchange: string,
  pair: string,
  active: boolean,
  route: ?url,
  routes: ?{
    price: url,
    summary: url,
    orderbook: url,
    trades: url,
    ohlc: url
  }
}

type marketPrice = {
  price: number
}

type marketSummary = {
  price: {
    last: number,
    high: number,
    low: number,
    change: {
      percentage: number,
      absolute: number
    }
  },
  volume: number
}

type order = { price: number, amount: number }

type orderBook = {
  asks: Array<order>,
  bids: Array<order>
}

type trade = {
  id: number,
  timestamp: number,
  price: number,
  amount: number
}

type asset = {
  id: id,
  symbol: string,
  name: string,
  fiat: boolean,
  route: ?url,
  markets: ?{ base: Array<market>, quote: Array<market> }
}

type pair = {
  id: id,
  symbol: string,
  base: asset,
  quote: asset,
  route: ?url,
  markets: ?Array<market>
}

type candle = {
  closeTime: number,
  openPrice: number,
  highPrice: number,
  lowPrice: number,
  closePrice: number,
  volume: number
}

type ohlc = {
  [number]: Array<candle>
}

type exchange = {
  symbol: string,
  name: string,
  active: boolean,
  route: ?string,
  routes: ?Array<string>
}

async function fetchMarkets (): Promise<Array<market>> {
  return returnResultFromUrl('https://api.cryptowat.ch/markets')
}

async function fetchExchanges (): Promise<Array<exchange>> {
  return returnResultFromUrl('https://api.cryptowat.ch/exchanges')
}

async function fetchExchangeDetails (symbol: string): Promise<exchange> {
  return {
    symbol,
    ...(await returnResultFromUrl(
      `https://api.cryptowat.ch/exchanges/${symbol}`
    ))
  }
}

async function fetchAssets (): Promise<Array<asset>> {
  return returnResultFromUrl('https://api.cryptowat.ch/assets')
}

async function fetchAssetDetails (symbol: string): Promise<asset> {
  return returnResultFromUrl(`https://api.cryptowat.ch/assets/${symbol}`)
}

async function fetchMarketDetails (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<market> {
  return returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}`
  )
}

async function fetchMarketPrice (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<marketPrice> {
  return returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}/price`
  )
}

async function fetchMarketSummary (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<marketSummary> {
  return returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}/summary`
  )
}

async function fetchMarketOrderBook (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<orderBook> {
  const result = await returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}/orderbook`
  )
  const orderFromArray: ([number, number]) => order = ([price, amount]) => ({
    price,
    amount
  })
  return {
    asks: result.asks.map(orderFromArray),
    bids: result.bids.map(orderFromArray)
  }
}

async function fetchMarketTrades (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<Array<trade>> {
  const result = await returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}/trades`
  )
  const tradeFromArray: ([number, number, number, number]) => trade = (
    [id, timestamp, price, amount]
  ) => ({
    id,
    timestamp,
    price,
    amount
  })
  return result.map(tradeFromArray)
}

async function fetchMarketOHLC (
  exchangeSymbol: string,
  pairSymbol: string
): Promise<ohlc> {
  const result = await returnResultFromUrl(
    `https://api.cryptowat.ch/markets/${exchangeSymbol}/${pairSymbol}/ohlc`
  )
  const candleFromArray: (
    [number, number, number, number, number, number]
  ) => candle = (
    [closeTime, openPrice, highPrice, lowPrice, closePrice, volume]
  ) => ({
    closeTime,
    openPrice,
    highPrice,
    lowPrice,
    closePrice,
    volume
  })
  return Object.keys(result).reduce(
    (acc, key) => ({
      ...acc,
      [key]: result[key].map(candleFromArray)
    }),
    {}
  )
}

async function fetchPairs (): Promise<Array<pair>> {
  return returnResultFromUrl(`https://api.cryptowat.ch/pairs`)
}

async function fetchPairDetails (pairSymbol: string): Promise<pair> {
  return returnResultFromUrl(`https://api.cryptowat.ch/pairs/${pairSymbol}`)
}

async function fetchPricesByPair (): Promise<{
  [string]: { [string]: number }
}> {
  const result = await returnResultFromUrl(
    `https://api.cryptowat.ch/markets/prices`
  )
  return Object.keys(result).reduce((acc, key) => {
    const [exchange, pair] = key.split(':')
    const pricesByExchangesForPair = acc[pair] || {}
    pricesByExchangesForPair[exchange] = result[key]
    return { ...acc, [pair]: pricesByExchangesForPair }
  }, {})
}

async function fetchPricesByExchange (): Promise<{
  [string]: { [string]: number }
}> {
  const result = await returnResultFromUrl(
    `https://api.cryptowat.ch/markets/prices`
  )
  return Object.keys(result).reduce((acc, key) => {
    const [exchange, pair] = key.split(':')
    const pricesByPairsForExchange = acc[exchange] || {}
    pricesByPairsForExchange[pair] = result[key]
    return { ...acc, [exchange]: pricesByPairsForExchange }
  }, {})
}

async function fetchAveragePrices (): Promise<{ [string]: number }> {
  const pricesByPair = await fetchPricesByPair()
  return Object.keys(pricesByPair).reduce(
    (acc, pair) => ({
      ...acc,
      [pair]:
        Object.keys(pricesByPair[pair])
          .filter(exchange => pricesByPair[pair][exchange] > 0)
          .reduce((sum, exchange) => sum + pricesByPair[pair][exchange], 0) /
        Object.keys(pricesByPair[pair]).length
    }),
    {}
  )
}

module.exports = {
  fetchMarkets,
  fetchMarketDetails,
  fetchMarketPrice,
  fetchMarketSummary,
  fetchMarketOrderBook,
  fetchMarketTrades,
  fetchMarketOHLC,
  fetchAssets,
  fetchAssetDetails,
  fetchPairs,
  fetchPairDetails,
  fetchExchanges,
  fetchExchangeDetails,
  fetchPricesByPair,
  fetchPricesByExchange,
  fetchAveragePrices
}
