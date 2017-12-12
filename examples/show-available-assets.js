// @flow

const { fetchAssets } = require('..')

async function main () {
  try {
    const assets = await fetchAssets()
    console.log(
      assets.map(asset => `${asset.name} (${asset.symbol})`).join('\n')
    )
  } catch (err) {
    console.error(err.stack)
  }
}

main()
