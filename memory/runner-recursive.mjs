import { induce as mostInduce } from '../most.mjs'
import { induce as xstreamInduce } from '../xstream.mjs'
import { induce as rxjsInduce } from '../rxjs.mjs'
import { induce as imperativeInduce } from '../imperative.mjs'
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

const writer = typeWriter('recursive-' + type)

let queue = Promise.resolve()

function cycle (induce, x) {
    x > 0 &&
        induce({
            resolve: function () {
                global.gc()
                // console.log('cycle', x)
                cycle(induce, x - 1)
            }
        })
}

memwatch.on('stats', function (info) {
    queue = queue.then(() => writer.writeRecords([info]))
})
global.gc()
cycle(induce[type], cycles)
global.gc()
