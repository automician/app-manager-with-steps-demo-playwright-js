import { withSteps } from './reporting/steps.proxy.js'
import * as proxy from '../common/proxy.js'

/* See https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
 * on why the following will not work:
 *
 * @template T
 * @type {(expect: T) => T}
 *
 * as a JSDoc comment for the following function.
 */

export const withMatchersAsSteps = expect =>
  proxy.wrapCallable(expect, (expectation, args) =>
    withSteps(expectation, {
      context:
        'expect' +
        (!!args.length
          ? (() => {
              const actual = args[0]
              const actual_string = actual.toString()
              const actual_description =
                actual_string === '[object Object]'
                  ? actual.constructor.name
                  : actual_string
              return ` ${actual_description}: `
            })()
          : ': '),
      box: false,
      cancelable: false,
      ignoreNonAsync: false, // ensured false for logging non-async expects
    }),
  )
