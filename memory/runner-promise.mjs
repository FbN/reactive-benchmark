import { induce as imperativeInduce } from '../imperative.mjs'
import { induce as mostInduce } from '../most.mjs'
import { induce as xstreamInduce } from '../xstream.mjs'
import { induce as rxjsInduce } from '../rxjs.mjs'
import { typeWriter } from './common.mjs'
import memwatch from '@HolgerFrank/node-memwatch'

const type = process.argv[2]
const cycles = parseInt(process.argv[3])

const induce = {
    imperative: imperativeInduce,
    most: mostInduce,
    xstream: xstreamInduce,
    rxjs: rxjsInduce
}

const writer = typeWriter('promise-' + type)

let queue = Promise.resolve()

function cycle (induce, x) {
    let runQueue = Promise.resolve()
    for (let i = 0; i < x; i++) {
        runQueue = runQueue.then(function () {
            return new Promise(function (resolve, reject) {
                induce({ resolve })
            }).then(function () {
                return global.gc()
            })
        })
    }
    return runQueue
}

memwatch.on('stats', function (info) {
    queue = queue.then(() => writer.writeRecords([info]))
})
global.gc()
cycle(induce[type], cycles)
global.gc()
