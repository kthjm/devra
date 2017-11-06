import { dotAndNestSquare } from './utils.js'

export const curly = {
   name: 'curly',
   brackets: '{}',
   others: ['[]', '()'],
   separater: '?',
   ho_replacement({ key, arg, replacers }) {
      return async fragment => {
         let { replacerKey, querystring } = fragment,
            replacer = replacers[replacerKey],
            query =
               querystring &&
               querystring
                  .split('&')
                  .map(key_value => {
                     let [queryKey, queryValue] = key_value.split('=')
                     return { [queryKey]: queryValue }
                  })
                  .reduce((p, c) => Object.assign(p, c))

         let replacement
         if (typeof replacer === 'function') {
            replacement = await replacer(key, query, arg)
         } else {
            console.error(`${replacerKey} is not set as replacer.`)
            replacement = ''
         }
         return replacement
      }
   }
}

export const square = {
   name: 'square',
   brackets: '[]',
   others: ['()', '{}'],
   separater: false,
   ho_replacement({ key, arg = {}, replacers }) {
      return async fragment => {
         let { replacerKey } = fragment,
            squareArg = Object.assign({}, arg, replacers)

         let replacement = await dotAndNestSquare(
            key,
            replacerKey,
            squareArg,
            this
         )
         return replacement
      }
   }
}

export const round = {
   name: 'round',
   brackets: '()',
   others: ['{}', '[]'],
   separater: ':',
   ho_replacement({ key, arg, replacers }) {
      return async fragment => {
         let { replacerKey, querystring } = fragment,
            replacer = replacers[replacerKey]

         let replacement
         if (typeof replacer === 'function') {
            replacement = await replacer(key, querystring, arg)
         } else {
            console.error(`${replacerKey} is not set as replacer.`)
            replacement = ''
         }
         return replacement
      }
   }
}
