import Controller from './controller.js'

const main = async () => {
  await new Controller().exec()
}

main()