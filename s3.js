import AWS from 'aws-sdk'
AWS.config.update({ region: 'ap-northeast-1' })

class S3 {
  constructor(bucket) {
    this.bucket = bucket
    this.s3 = new AWS.S3()
  }

  async upload(key, data) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: data,
    };
    return await this.s3.putObject(params).promise()
  }
}

export default S3