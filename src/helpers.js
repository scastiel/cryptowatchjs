// @flow

const fetch = require('isomorphic-fetch')

async function returnResultFromUrl (url: string): Promise<any> {
  const res = await fetch(url)
  const json = await res.json()
  return json.result
}

module.exports = { returnResultFromUrl }
