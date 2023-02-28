import fetch from 'node-fetch'
import dt from 'date-utils'
import S3 from './s3.js'

// message api endpoint.
// @see https://mailcatcher.me/
//　'http://localhost:1080/messages'
const URL = process.env.URL
const BUCKET = process.env.BUCKET
const S3_SITE_URL = `http://${BUCKET}.s3-website-ap-northeast-1.amazonaws.com`

class Controller {
  constructor() {
    this.s3 = new S3(BUCKET)
    this.date = new Date().toFormat('YYYYMMDD')
  }

  async exec() {
    const response = await fetch(URL)
    const messages = await response.json()
    const summary = [`<h1>${this.date} MailCatcher Backup.</h1>`]

    for await (const message of messages) {
      const key = `${message.id}.plain`
      const res = await fetch(`${URL}/${key}`)
      const arrayBuffer = await res.arrayBuffer()
      const text = new TextDecoder('iso-2022-jp').decode(arrayBuffer)

      await this.s3.upload(`${this.date}/${key}`, text)
      summary.push(`<div>subject: ${message.subject}<br />body: <a href="${S3_SITE_URL}/${this.date}/${key}">${this.date}/${key}</a><br />sender: ${message.sender.replace(/[&'`"<>]/g, '')}<br />
          recipients: ${message.recipients.join().replace(/[&'`"<>]/g, '')}<br />created_at: ${message.created_at}<hr></div>`)
    }

    await this.s3.upload(`${this.date}/index.html`, summary.join(''))
  }
}

export default Controller