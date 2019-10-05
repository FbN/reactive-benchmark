import Benchmark from 'benchmark'
import { induce as mostInduce } from './most.mjs'
import { induce as xstreamInduce } from './xstream.mjs'
import { induce as rxInduce } from './rxjs.mjs'

const suite = new Benchmark.Suite()

suite
    .add('most', mostInduce, { defer: true })
    .add('xstream', xstreamInduce, { defer: true })
    .add('rxjs', rxInduce, { defer: true })
    .on('cycle', function (event) {
        console.log(String(event.target))
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run({ async: true })
