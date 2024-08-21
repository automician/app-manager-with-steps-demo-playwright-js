import { test } from '@playwright/test'
import * as proxy from '../proxy.js'

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

export function withSteps(obj) {
  return proxy.wrapMethodCalls(obj, function (prop, args, callback) {
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
      return test.step(
        `${obj_description}: ${prop}` +
          (args.length ? `: ${JSON.stringify(args, null, 2).slice(1, -1)}` : ''),
        callback,
        // on true – will log exact failed line in a test file, but also logs proxy code :(
        // { box: true}, // TODO: can we make it not pointing to proxy's code?
        // seems like currently false is the only usable value in context of log readability
        // the failed line of code in a test file still can be found in the end of stacktrace
        { box: false }, // TODO: make it configurable via project settings & dotenv or not?
      )
    } else {
      return callback()
    }
  })
}
