/**
 * Representação de um valor `Left`, indicando um erro ou falha.
 * 
 * @template T - Tipo do erro.
 * @property {T} left - O valor do erro.
 * @property {never} [right] - Garante que um `Left` não tenha um `Right`.
 */
export type Left<T> = {
    left: T
    right?: never
  }
  
  
/**
 * Representação de um valor `Right`, indicando um sucesso ou resposta esperada.
 * 
 * @template U - Tipo do valor esperado.
 * @property {U} right - O valor da resposta esperada.
 * @property {never} [left] - Garante que um `Right` não tenha um `Left`.
 */
  export type Right<U> = {
    left?: never
    right: U
  }
  
  export type Either<T, U> = NonNullable<Left<T> | Right<U>>
  
  export const isLeft = <T, U>(e: Either<T, U>): e is Left<T> => {
    return e.left !== undefined
  }
  
  export const isRight = <T, U>(e: Either<T, U>): e is Right<U> => {
    return e.right !== undefined
  }
  
  export type UnwrapEither = <T, U>(e: Either<T, U>) => NonNullable<T | U>
  

/**
 * Desempacota um `Either`, retornando o valor contido dentro de `Left` ou `Right`.
 * 
 * @template T - Tipo do erro.
 * @template U - Tipo da resposta esperada.
 * @param {Either<T, U>} e - O objeto `Either` a ser desempacotado.
 * @returns {T | U} O valor contido dentro do `Either`.
 * @throws {Error} Se `Either` conter ambos os valores ou nenhum deles, um erro será lançado.
 *
 * @example
 * const result = makeRight(100);
 * console.log(unwrapEither(result)); // 100
 */
  export const unwrapEither: UnwrapEither = <T, U>({
    left,
    right,
  }: Either<T, U>) => {
    if (right !== undefined && left !== undefined) {
      throw new Error(
        `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(
          left
        )}\nRight: ${JSON.stringify(right)}`
      )
    }
  
    if (left !== undefined) {
      return left as NonNullable<T>
    }
  
    if (right !== undefined) {
      return right as NonNullable<U>
    }
  
    throw new Error(
      'Received no left or right values at runtime when opening Either'
    )
  }
  
  export const makeLeft = <T>(value: T): Left<T> => ({ left: value })
  
  export const makeRight = <U>(value: U): Right<U> => ({ right: value })