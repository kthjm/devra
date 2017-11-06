import Devracket from './Devracket.js'
import { curly, square, round } from './constants.js'

const devracketCurly = new Devracket(curly)
const devracketSquare = new Devracket(square)
const devracketRound = new Devracket(round)

export default class Devra {
   constructor({ curly = {}, round = {}, square = {}, templates = {} }) {
      this.replacers = { curly, round, square }
      this.templates = templates
   }

   // set(name,template){
   //     this.templates[name] = template;
   // }

   async out(name, arg = {}) {
      let solid = await this.recursive(this.templates[name], arg)
      return solid
   }

   async transform(template, arg = {}) {
      let solid = await this.recursive(template, arg)
      return solid
   }

   async recursive(template, arg) {
      if (typeof template !== 'object')
         throw new Error(`template must be "object".`)

      if (Array.isArray(template)) {
         return Promise.all(
            [].concat(template).map(async value => {
               value = await this.judge(null, value, arg)
               return value
            })
         )
      } else {
         let obj = {}

         let entries = Object.entries(template)
         if (entries.length) {
            await Promise.all(
               entries.map(async ([key, value]) => {
                  obj[key] = await this.judge(key, value, arg)
               })
            )
         }

         return obj
      }
   }

   async judge(key, value, arg) {
      if (typeof value === 'object') {
         return this.recursive(value, arg)
      } else if (typeof value !== 'string' || !value.includes('$')) {
         return value
      } else {
         let { replacers } = this

         value = await devracketCurly.exec(key, value, arg, replacers)
         if (typeof value !== 'object' && typeof value !== 'function') {
            value = await devracketSquare.exec(key, value, arg, replacers)
            if (typeof value !== 'object' && typeof value !== 'function') {
               value = await devracketRound.exec(key, value, arg, replacers)
            }
         }

         return value
      }
   }
}
