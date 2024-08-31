import { test } from '@playwright/test'
import * as proxy from '../../common/proxy.js'
import { config } from '../../../../project.config.js'

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
 *   box: boolean,
 *   cancelable: boolean,
 * }>} options
 */
export function withSteps(obj, options = {}) {
  // TODO: consider: `if (matchesRequired('project.config.js', config => config?.disableObjectSteps)) return obj`'))
  if (config.disableObjectSteps) return obj

  return proxy.wrapMethodCalls(obj, function (prop, args, callback) {
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
    if (!ignored.some(it => (it instanceof RegExp ? it.test(prop) : it === prop))) {
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
      return test.step(
        `${get_context()}${prop}` +
          (args.length ? `: ${JSON.stringify(args, null, 2).slice(1, -1)}` : ''),
        callback,
        // on true – logs proxy code in the main error message code excerpt :(
        // { box: true}, // TODO: can we make it not pointing to proxy's code?
        // seems like currently false is the only usable value in context of log readability
        { box: options?.box ?? false }, // TODO: make it configurable via project settings & dotenv or not?
        // yet in both cases:
        // + the failed line of code in a test file still can be found in the end of stacktrace
        // - but the proxy failed line of code yet is visible in html report in steps list :(
        //   TODO: can we fix it?
      )
    } else {
      return callback()
    }
  })
}
