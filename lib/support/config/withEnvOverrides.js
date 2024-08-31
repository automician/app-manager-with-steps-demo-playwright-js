import * as proxy from '../common/proxy.js'

/**
 * @template T
 * @param {T} obj
 * @returns {T}
 */
export default obj =>
  proxy.wrapProperties(obj, (prop, getValue) => {
    const value = getValue()
    return typeof value === 'string'
      ? process.env[prop] ?? value
      : typeof value === 'boolean'
      ? /true/.test(process.env[prop] ?? '') ?? value
      : typeof value === 'number'
      ? Number(process.env[prop] ?? value)
      : value
  })
