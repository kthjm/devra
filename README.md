# devra

## WIP for publish

[![styled with prettier]()]()
[![Build Status]()]()
[![Coverage Status]()]()

## Installation
```shell
```
## Usage
```js
```
## API
## License
MIT (http://opensource.org/licenses/MIT)

## Old

* `options.shallow`
* bench mark test to compare with normal data created
* `$` => `#`
    * [devraはfnのvariableとして二種類あったことには理由があって](https://www.facebook.com/toxictoxer/posts/2012829412303952)
* or `regexp`//

devra is template `JSON` to `object`.

### variable type

they are function as replacer.

- **`curly ${}`**
    - result by **multi query function** recieve query as `object`
    - query separater is `?`
- **`round $()`**
    - result by **single query function** recieve query as `string`
    - query separater is `:`
- **`square $[]`**
    - result by **just replace by arg**
    - arg is `devra.out(name,{square})`

priority is **`curly => square => round`**

### sample code

*templates.json*
```json
{
    "template1": {
        "key1": "${myCurlyProcess1?query1=10&query2=100}",
        "key2": "$(myRoundProcess1:wfenjknkjcnwefnfken)",
        "key3": "$[squareArg1]",
        "key4": "$[squareArg2.value]",
        "key5": "$(myRoundProcess2:${myCurlyProcess2?query3=1000} and $[squareArg3.nest.value])"
    }
}
```

*processors.js*
```javascript
export const curly = {
    myCurlyProcess1: (key,query,arg) => {
        console.log(query); /* {query1: 10, query2: 100} */
        return "i am key1";
    },
    myCurlyProcess2: (key,query,arg) => {
        console.log(query); /* {query3: 1000} */
        return "i am key5 fragment via curly";
    },
}

export const round = {
    myRoundProcess1: (key,query,arg) => {
        console.log(query); /* wfenjknkjcnwefnfken */
        return "i am key2";
    }

    myRoundProcess1: (key,query,arg) => {
        console.log(query); /* i am key5 fragment via curly and i am key5 fragment via square */
        return `i am key 5 wrap via round (${query})`.split(" ");
    }
}
```

*main.js*
```javascript
import Devra from "devra";
import templates from "./templates.js";
import {curly,round} from "./processors.js";

const devra = new Devra({curly,round});

Object.entries(templates)
.forEach(([name,template])=>(
    devra.set(name,template)
));

devra.out("template1",{
    curly: {},
    round: {},
    // processor's third argument

    square: {
        squareArg1: "i am key3",
        squareArg2: {
            value: "i am key4"
        },
        squareArg3: {
            nest: {
                value: "i am key5 fragment via square"
            }
        }
    }
})
.then((result)=>(console.log(result)
    /*
    {
        key1: "i am key1",
        key2: "i am key2",
        key3: "i am key3",
        key4: "i am key4",
        key5: "iamkey5wrapviaround(iamkey5fragmentviacurlyandiamkey5fragmentviasquare)"
    }
    */
))
.catch((err)=>(console.error(err)))
```

*alternative.js*
```javascript
import template from "./template.js";

(async ()=>{
    let result = await devra.transform(template,{
        curly: {},
        round: {},
        square: {}
    });

    return result;
})()
```