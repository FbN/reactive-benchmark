import { induce as mostInduce } from './most.mjs'
import { induce as xstreamInduce } from './xstream.mjs'
import fs from 'fs'
import csvWriter from 'csv-write-stream'
// import memoryUsage from 'memory-usage'
import memwatch from '@HolgerFrank/node-memwatch'

const cycles = 1000

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
    console.log(info)
})

// memoryUsage(1000, { gc: 'Scavenge' })
//     .pipe(csvWriter())
//     .pipe(fs.createWriteStream('.tmp/memory.csv'))

cycle(mostInduce, cycles)
global.gc()
