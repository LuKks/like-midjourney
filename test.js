const dotenv = require('dotenv')
const test = require('brittle')
const Midjourney = require('./index.js')

dotenv.config()

test('basic', { timeout: 90000 }, async function (t) {
  const midjourney = new Midjourney()

  const id = await midjourney.imagine('Programmatic: A split-screen futuristic background highlighting a "Before vs. After" transformation')

  const image1 = await midjourney.cdn(id, 0)
  const image2 = await midjourney.cdn(id, 1)
  const image3 = await midjourney.cdn(id, 2)
  const image4 = await midjourney.cdn(id, 3)

  t.ok(image1.byteLength > 1024 * 1024)
  t.ok(image2.byteLength > 1024 * 1024)
  t.ok(image3.byteLength > 1024 * 1024)
  t.ok(image4.byteLength > 1024 * 1024)
})
