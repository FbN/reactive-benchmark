// import fs from 'fs'
import { spawnSync } from 'child_process'
import csv from 'csv-parser'
import fs from 'fs'
import csvWriter from 'csv-writer'
import config from '../config.mjs'

const runners = ['promise', 'recursive']
const types = ['imperative', 'rxjs', 'most', 'xstream']

runners.forEach(runner => {
    try {
        types
            .map(type =>
                spawnSync(
                    process.argv[0],
                    [
                        '--experimental-modules',
                        '--expose-gc',
                        './memory/runner-' + runner + '.mjs',
                        type,
                        config.iterations
                    ],
                    { stdio: 'inherit' }
                )
            )
    } catch (e) {
        console.error('error', e)
    }

    const writer = csvWriter.createArrayCsvWriter({
        path: '.tmp/memory_' + runner + '.csv',
        header: types
    })

    let queue = Promise.resolve()

    const readType = type =>
        new Promise(function (resolve, reject) {
            const rows = []
            fs.createReadStream('.tmp/memory_' + runner + '-' + type + '.csv')
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
            r[0].reduce((acc, r0, i) => {
                const row = []
                for (let j = 0; j < r.length; j++) {
                    row.push(r[j][i])
                }
                return [...acc, row]
            }, [])
        )
        .then(r => {
            queue = queue.then(() => writer.writeRecords(r))
        })
        .then(() => {
            queue.then(() => {
                const cmd =
                    'cat .tmp/memory_' +
                    runner +
                    '.csv | ./node_modules/.bin/chart-csv > .tmp/data-' +
                    runner +
                    '.html'

                spawnSync('sh', ['-c', cmd], { stdio: 'inherit' })
            })
        })
})
