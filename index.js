let got = null

const API_URL = 'https://www.midjourney.com'
const CDN_URL = 'https://cdn.midjourney.com'

module.exports = class Midjourney {
  constructor (opts = {}) {
    this.cookies = opts.cookies || process.env.MIDJOURNEY_COOKIES
    this.channelId = opts.channelId || process.env.MIDJOURNEY_CHANNEL_ID
  }

  // TODO: Implement login
  // TODO: Queue

  async api (pathname, opts = {}) {
    if (got === null) {
      got = await importGot()
    }

    const response = await got(API_URL + pathname, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-protection': '1',
        cookie: this.cookies
      },
      body: opts.body ? JSON.stringify(opts.body) : null
    })

    const data = JSON.parse(response.body)

    if (data.error) {
      throw new Error('API failed with an error: ' + data.error)
    }

    return data
  }

  async cdn (id, index, opts = {}) {
    if (got === null) {
      got = await importGot()
    }

    const response = await got(CDN_URL + '/' + id + '/0_' + index + '.png', {
      method: opts.method ? opts.method : 'GET',
      headers: {
        'cache-control': 'no-cache',
        pragma: 'no-cache'
      }
    })

    if (response.statusCode === 403 || response.statusCode === 404) {
      return null
    }

    const data = response.rawBody

    return data
  }

  async imagine (prompt) {
    const data = await this.api('/api/app/submit-jobs', {
      body: {
        f: { mode: 'fast', private: false },
        channelId: this.channelId,
        roomId: null,
        metadata: {
          isMobile: null,
          imagePrompts: 0,
          imageReferences: 0,
          characterReferences: 0,
          depthReferences: 0,
          lightboxOpen: null
        },
        t: 'imagine',
        prompt: prompt + ' --v 6.1'
      }
    })

    if (data.failure.length > 0) {
      const err = data.failure[0]

      throw new Error(err.type + ': ' + err.message)
    }

    const job = data.success[0]

    await this._waitForJobImage(job.job_id, 0)
    await this._waitForJobImage(job.job_id, 1)
    await this._waitForJobImage(job.job_id, 2)
    await this._waitForJobImage(job.job_id, 3)

    return job.job_id
  }

  async _waitForJobImage (id, index) {
    while (true) {
      const image = await this.cdn(id, index, { method: 'HEAD' })
      let attempts = 0

      if (image === null) {
        if (++attempts === 60) {
          throw new Error('Image generation timed out')
        }

        await new Promise(resolve => setTimeout(resolve, 2000))

        continue
      }

      break
    }
  }
}

async function importGot () {
  return (await import('got-scraping')).gotScraping
}
