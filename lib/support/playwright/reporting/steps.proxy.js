import { test } from '@playwright/test'
import * as proxy from '../../common/proxy.js'
import { config } from '../../../../project.config.js'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)

/** So regex can be serialized (used in test steps reporting) */
Object.defineProperty(RegExp.prototype, 'toJSON', {
  value: RegExp.prototype.toString,
})

export function withLoggedSteps(obj) {
  return proxy.interceptMethodCalls(obj, function (prop, args) {
    // TODO: move this list to config;)
    const ignored = [
      // skipe methods ...
      /^_/, // that are kind of "private" and are not considered to be used in tests as steps
      /^\$/, // as an additinal prefix to be used to ignore step application to some method
      /^toString$/,
    ]
    if (!ignored.some(it => it.test(prop))) {
      const obj_string = obj.toString()
      const obj_description =
        obj_string === '[object Object]' ? obj.constructor.name : obj_string
      console.log(
        `>>> ${obj_description}: ${prop} >>> ${JSON.stringify(args, null, 2)}`,
      )
    }
  })
}

/**
 * @param {any} obj
 * @param {Partial<{
 *   context: string | (() => string),
 *   ignore: (string | RegExp)[],
 *   ignoreAlso: (string | RegExp)[],
 *   ignoreNonAsync: boolean,
 *   box: boolean,
 *   cancelable: boolean,
 * }>} options
 */
export function withSteps(obj, options = {}) {
  // TODO: consider: `if (matchesRequired('project.config.js', config => config?.disableObjectSteps)) return obj`'))
  const cancelable = options?.cancelable ?? true
  if (cancelable && config.cancelWithSteps) return obj
  // TODO: consider: making default to be configurable via config or env
  const ignoreNonAsync = options?.ignoreNonAsync ?? false

  return proxy.wrapMethodCalls(obj, function fn(prop, args, callback) {
    const ignored = [
      ...(options?.ignore ?? [
        // TODO: reflect this list of defaults in config;)
        // skipe methods ...
        /^_/, // that are kind of "private" and are not considered to be used in tests as steps
        /^\$/, // as an additinal prefix to be used to ignore step application to some method
        'toString',
      ]),
      ...(options?.ignoreAlso ?? []),
    ]
    const AsyncFunction = (async () => {}).constructor
    const GeneratorFunction = function* () {}.constructor
    if (
      ignored.some(it => (it instanceof RegExp ? it.test(prop) : it === prop)) ||
      (ignoreNonAsync &&
        !(
          obj[prop] instanceof AsyncFunction &&
          AsyncFunction !== Function &&
          AsyncFunction !== GeneratorFunction
        ))
      // ⬆️ explained at https://stackoverflow.com/a/38510353/1297371
    ) {
      return callback()
    }

    const get_context =
      options?.context === undefined
        ? () => {
            const obj_string = obj.toString()
            const obj_description =
              obj_string === '[object Object]' ? obj.constructor.name : obj_string
            return !!obj_description ? `${obj_description}: ` : ''
          }
        : options.context instanceof Function
        ? options.context
        : () => options.context
    return test
      .step(
        `${get_context()}${prop}` +
          (args.length ? `: ${JSON.stringify(args, null, 2).slice(1, -1)}` : ''),
        callback,
        { box: options?.box ?? false }, // TODO: make it configurable via project settings & dotenv or not?
      )
      .then(
        result => result,
        error => {
          // TODO: consider reusing helpers from `lib/support/common/proxy.js` (refactored correspondingly)

          // clean stacktrace from this proxy code
          error.stack = error.stack
            .split('\n')
            .filter(line => !line.includes(__filename))
            .map(line =>
              line.replace(/^(.*)Proxy\.(apply|get|construct) \((.*)\)$/, '$1$3'),
            )
            .join('\n')

          throw error
        },
      )
  })
}

/**
 * @param {any} obj
 * @param {Partial<{
 *   context: string | (() => string),
 *   ignore: (string | RegExp)[],
 *   ignoreAlso: (string | RegExp)[],
 *   box: boolean,
 *   cancelable: boolean,
 * }>} options
 */
export function withAsyncAsSteps(obj, options = {}) {
  return withSteps(obj, { ...options, ignoreNonAsync: true })
}
