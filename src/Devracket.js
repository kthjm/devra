import { valueToFragments, fragmentsToOne } from './utils.js'

function Devracket({ name, brackets, others, separater, ho_replacement }) {
   this.name = name
   this.brackets = brackets
   this.halfBracket = brackets.split('')[0]
   this.others = others
   this.halfOthers = others.map(fullOther => fullOther.slice(0, 1))
   this.separater = separater
   this.ho_replacement = ho_replacement
}

Devracket.prototype.exec = async function(key, value, arg, replacers) {
   let includesOrNot = '$' + this.halfBracket
   if (!value.includes(includesOrNot)) {
      return value
   } else {
      let { name } = this
      value = await fragmentsToOne(
         valueToFragments(value, this),
         this.ho_replacement({
            key,
            arg: arg[name],
            replacers: replacers[name]
         })
      )
      return value
   }
}

export default Devracket
