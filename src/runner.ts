export type Next = () => Promise<void> | void

export type Middleware<T> = (context: T, next: Next) => Promise<void> | void

export type Pipeline<T> = {
  use: (...middlewares: Middleware<T>[]) => void
  handle: (context: T) => Promise<void>
}

export function Runner<T>(...middlewares: Middleware<T>[]): Pipeline<T> {
  const stack: Middleware<T>[] = middlewares

  const use: Pipeline<T>['use'] = (...middlewares) => {
    stack.push(...middlewares)
  }

  const handle: Pipeline<T>['handle'] = async (context) => {
    let prevIndex = -1

    const next = async (index: number): Promise<void> => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times')
      }

      prevIndex = index

      const middleware = stack[index]

      if (middleware) {
        await middleware(context, () => {
          return next(index + 1)
        })
      }
    }

    await next(0)
  }

  return { use, handle }
}