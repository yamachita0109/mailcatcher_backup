import Controller from './controller.js'

exports.handler = async (event) => {
  await new Controller().exec(type)
  return {
    result: 'ok',
  }
}