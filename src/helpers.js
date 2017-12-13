// @flow

function getFetch () {
  /* global fetch */
  try {
    if (fetch) {
      return fetch
    }
  } catch (err) {}
  try {
    return require('isomorphic-fetch')
  } catch (err) {}
  throw new Error('Cannot find an implementation of `fetch`.')
}

async function returnResultFromUrl (url: string): Promise<any> {
  const fetch = getFetch()
  const res = await fetch(url)
  const json = await res.json()
  return json.result
}

module.exports = { returnResultFromUrl }
