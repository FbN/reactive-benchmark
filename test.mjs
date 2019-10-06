import { induce as mostInduce } from './most.mjs'
import { induce as xstreamInduce } from './xstream.mjs'
import { induce as rxInduce } from './rxjs.mjs'
import assert from 'assert'
// import { induce as rxInduce } from './rxjs.mjs'

const most = new Promise(function (resolve, reject) {
    mostInduce({
        resolve
    })
})

const xstream = new Promise(function (resolve, reject) {
    xstreamInduce({
        resolve
    })
})

const xs = new Promise(function (resolve, reject) {
    rxInduce({
        resolve
    })
})

Promise.all([most, xstream, xs]).then(([mostRes, xstreamRes, xsRes]) => {
    assert.deepStrictEqual(mostRes, xstreamRes)
    assert.deepStrictEqual(mostRes, xsRes)
    console.log('OK')
})
