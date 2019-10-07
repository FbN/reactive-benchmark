import { induce as mostInduce } from '../most.mjs'
import { induce as xstreamInduce } from '../xstream.mjs'
import { induce as rxjsInduce } from '../rxjs.mjs'
import { typeWriter } from './common.mjs'
import memwatch from '@HolgerFrank/node-memwatch'

const type = process.argv[2]
const cycles = parseInt(process.argv[3])

const induce = {
    most: mostInduce,
    xstream: xstreamInduce,
    rxjs: rxjsInduce
}

const writer = typeWriter(type)

let queue = Promise.resolve()

function cycle (induce, x) {
    x > 0 &&
        induce({
            resolve: function () {
                global.gc()
                cycle(induce, x - 1)
            }
        })
}

memwatch.on('stats', function (info) {
    queue = queue.then(() => writer.writeRecords([info]))
})

cycle(induce[type], cycles)
global.gc()
