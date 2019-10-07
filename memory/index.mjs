// import fs from 'fs'
import { spawnSync } from 'child_process'
import csv from 'csv-parser'
import fs from 'fs'
import csvWriter from 'csv-writer'
import config from '../config.mjs'

const types = ['rxjs', 'most', 'xstream']
try {
    types
        .map(type =>
            spawnSync(
                process.argv[0],
                [
                    '--experimental-modules',
                    '--expose-gc',
                    './memory/runner.mjs',
                    type,
                    config.iterations
                ],
                { stdio: 'inherit' }
            )
        )
        .map(console.log)
} catch (e) {
    console.error()
}

const writer = csvWriter.createArrayCsvWriter({
    path: '.tmp/memory.csv',
    header: types
})

let queue = Promise.resolve()

const readType = type =>
    new Promise(function (resolve, reject) {
        const rows = []
        fs.createReadStream('.tmp/memory_' + type + '.csv')
            .pipe(csv())
            .on('data', data => {
                rows.push(parseInt(data.used_heap_size))
            })
            .on('end', () => {
                resolve(rows)
            })
    })

Promise.all(types.map(readType))
    .then(r =>
        r[0].reduce((acc, r0, i) => [...acc, [r0, r[1][i], r[2][i]]], [])
    )
    .then(r => {
        queue = queue.then(() => writer.writeRecords(r))
    })

queue.then(() => {
    const cmd =
        'cat .tmp/memory.csv | ./node_modules/.bin/chart-csv > .tmp/data.html'

    spawnSync('sh', ['-c', cmd], { stdio: 'inherit' })
})
