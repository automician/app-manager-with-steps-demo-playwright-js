/*
 * The implementation below is inspired by
 * https://javascript.plainenglish.io/javascript-how-to-intercept-function-and-method-calls-b9fd6507ff02
 * todo: Ensure works with #-marked private props
 */

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
