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

// most.then(mostRes => console.log('most', mostRes.length))
//
// xstream.then(xstreamRes => console.log('xstream', xstreamRes.length))
//
// most.then(mostRes => console.log('most', mostRes[mostRes.length - 1]))
//
// xstream.then(xstreamRes =>
//     console.log('xstream', xstreamRes[xstreamRes.length - 1])
// )

Promise.all([most, xstream, xs]).then(([mostRes, xstreamRes, xsRes]) => {
    assert.deepStrictEqual(mostRes, xstreamRes)
    assert.deepStrictEqual(mostRes, xsRes)
    console.log('OK')
    // console.log('most', mostRes[0])
    // console.log('xs', xsRes[0])
    // console.log('most', mostRes[mostRes.length - 1])
    // console.log('xs', xsRes[xstreamRes.length - 1])
})
