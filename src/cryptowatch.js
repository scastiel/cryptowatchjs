// @flow

const fetch = require('isomorphic-fetch')

type market = {
  id: number,
  exchange: string,
  pair: string,
  active: boolean,
  route: string
}

type asset = {
  id: number,
  symbol: string,
  name: string,
  fiat: boolean,
  route: ?string,
  markets: ?{ base: Array<market>, quote: Array<market> }
}

async function fetchMarkets (): Promise<Array<market>> {
  const res = await fetch('https://api.cryptowat.ch/markets')
  const json = await res.json()
  return json.result
}

async function fetchAssets (): Promise<Array<asset>> {
  const res = await fetch('https://api.cryptowat.ch/assets')
  const json = await res.json()
  return json.result
}

async function fetchAssetDetails (symbol: string): Promise<asset> {
  const res = await fetch(`https://api.cryptowat.ch/assets/${symbol}`)
  const json = await res.json()
  return json.result
}

module.exports = { fetchMarkets, fetchAssets, fetchAssetDetails }
