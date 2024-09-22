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
              const actualString = actual.toString()
              const actualDescription =
                actualString === '[object Object]'
                  ? actual.constructor.name
                  : actualString
              return ` ${actualDescription}: `
            })()
          : ': '),
      box: false,
      cancelable: false,
      ignoreNonAsync: false, // ensured false for logging non-async expects
    }),
  )
