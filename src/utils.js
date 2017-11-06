const toKeyAndQuery = (variable, devracket) => {
   if (devracket.halfBracket === '[') {
      return { replacerKey: variable }
   } else {
      let queryIndex = variable.indexOf(devracket.separater)
      return queryIndex === -1
         ? { replacerKey: variable }
         : {
              replacerKey: variable.slice(0, queryIndex),
              querystring: variable.slice(queryIndex + 1)
           }
   }
}

export const valueToFragments = (str, devracket) => {
   let [start, close] = devracket.brackets.split('')
   return []
      .concat(
         ...str.split('$').map((str, index, stres) => {
            if (index === 0) {
               if (!str) {
                  let [a, b] = devracket.halfOthers,
                     next0 = stres[1][0]
                  if (next0 === a || next0 === b) {
                     str = '$'
                  }
               }
               return str
            } else if (str[0] !== start) {
               return str
            } else {
               let closeIndex = str.lastIndexOf(close),
                  variable = str.slice(1, closeIndex),
                  other = str.slice(closeIndex + 1)

               variable = toKeyAndQuery(variable, devracket)
               return [variable, other]
            }
         })
      )
      .filter(str => str)
}

export const fragmentsToOne = async (fragments, cb) => {
   fragments = await Promise.all(
      fragments.map(async fragment => {
         if (typeof fragment !== 'object') {
            return fragment
         } else {
            fragment = await cb(fragment)
            return fragment
         }
      })
   )

   return fragments.some(el => typeof el === 'object')
      ? fragments.find(el => typeof el === 'object')
      : fragments.some(el => typeof el === 'function')
        ? fragments.find(el => typeof el === 'function')
        : fragments.join('')
}

export const dotAndNestSquare = async (key, replacerKey, arg, devracket) => {
   if (replacerKey.includes('.')) {
      let commaIndex = replacerKey.indexOf('.'),
         useAsKey = replacerKey.slice(0, commaIndex),
         newKey = replacerKey.slice(commaIndex + 1),
         newArg = arg[useAsKey]
      return dotAndNestSquare(key, newKey, newArg, devracket)
   } else {
      let value = arg[replacerKey]
      if (typeof value === 'string' && value.includes('$[')) {
         value = await fragmentsToOne(
            valueToFragments(value, devracket),
            devracket.ho_replacement({ key, arg })
         )
      }
      return value
   }
}
