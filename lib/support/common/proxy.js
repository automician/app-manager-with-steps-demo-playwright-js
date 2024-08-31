/*
 * The implementation below is inspired by
 * - https://javascript.plainenglish.io/javascript-how-to-intercept-function-and-method-calls-b9fd6507ff02
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 * todo: Ensure works with #-marked private props
 */

// TODO: add typehints
export function interceptMethodCalls(obj, fn) {
  return new Proxy(obj, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return new Proxy(target[prop], {
          apply: (target, thisArg, argumentsList) => {
            fn(prop, argumentsList)
            return Reflect.apply(target, thisArg, argumentsList)
          },
        })
      } else {
        return Reflect.get(target, prop)
      }
    },
  })
}

// TODO: add typehints
export function wrapMethodCalls(obj, fn) {
  return new Proxy(obj, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return new Proxy(target[prop], {
          apply: (target, thisArg, argumentsList) => {
            const callback = () => Reflect.apply(target, thisArg, argumentsList)
            return fn(prop, argumentsList, callback)
          },
        })
      } else {
        return Reflect.get(target, prop)
      }
    },
  })
}

/**
 * @template T
 * @param {T} obj
 * @param {(prop, value_getter) => any} propAndGetterCallback decorator
 * @returns {T}
 */
export function wrapProperties(obj, propAndGetterCallback) {
  return new Proxy(/** @type {object} */ (obj), {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return target[prop]
      } else {
        const getter = () => target[prop]
        return propAndGetterCallback(prop, getter)
      }
    },
  })
}

/**
 * @template T
 * @param {T} obj collable
 * @param {(callableResult, callableArgs) => any} resultCallback decorator
 * @returns {T}
 */
export function wrapCallable(obj, resultCallback) {
  return new Proxy(/** @type {object} */ (obj), {
    apply: (target, thisArg, argumentsList) => {
      return resultCallback(
        Reflect.apply(target, thisArg, argumentsList),
        argumentsList,
      )
    },
  })
}
