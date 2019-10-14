import { induce as imperativeInduce } from './imperative.mjs'
import { induce as mostInduce } from './most.mjs'
import { induce as xstreamInduce } from './xstream.mjs'
import { induce as rxInduce } from './rxjs.mjs'
import assert from 'assert'

const imperative = new Promise(function (resolve, reject) {
    imperativeInduce({
        resolve: () =>
            imperativeInduce({
                resolve
            })
    })
})

const most = new Promise(function (resolve, reject) {
    mostInduce({
        resolve: () =>
            mostInduce({
                resolve
            })
    })
})

const xstream = new Promise(function (resolve, reject) {
    xstreamInduce({
        resolve: () =>
            xstreamInduce({
                resolve
            })
    })
})

const xs = new Promise(function (resolve, reject) {
    rxInduce({
        resolve: () =>
            rxInduce({
                resolve
            })
    })
})

Promise.all([imperative, most, xstream, xs]).then(
    ([imperativeRes, mostRes, xstreamRes, xsRes]) => {
        assert.deepStrictEqual(imperativeRes, mostRes)
        assert.deepStrictEqual(imperativeRes, xstreamRes)
        assert.deepStrictEqual(imperativeRes, xsRes)
        // console.log(' ==== most', mostRes)
        // console.log(' ==== imperative', imperativeRes)
        console.log('OK')
    }
)
