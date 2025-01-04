# like-midjourney

MidJourney API wrapper for Node.js

```
npm i like-midjourney
```

## Usage

```js
const fs = require('fs')
const Midjourney = require('like-midjourney')

const midjourney = new Midjourney()

const id = await midjourney.imagine('Create a random colored image.')

const image1 = await midjourney.cdn(id, 0)
const image2 = await midjourney.cdn(id, 1)
const image3 = await midjourney.cdn(id, 2)
const image4 = await midjourney.cdn(id, 3)

await fs.promises.writeFile('./image1.png', image1)
await fs.promises.writeFile('./image2.png', image2)
await fs.promises.writeFile('./image3.png', image3)
await fs.promises.writeFile('./image4.png', image4)
```

## API

#### `midjourney = new Midjourney([options])`

Create a Midjourney instance.

Available options:

```js
{
  cookies: process.env.MIDJOURNEY_COOKIES,
  channelId: process.env.MIDJOURNEY_CHANNEL_ID
}
```

#### `id = await midjourney.imagine(prompt)`

Generate 4 image variations.

Returns the job id.

#### `image = await midjourney.cdn(id, index)`

Download one of the variations.

Returns a buffer.

## License

MIT
