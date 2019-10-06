import XS from 'xstream'
import SC from 'xstream/extra/sampleCombine'
import D from 'xstream/extra/delay'

const sampleCombine = SC.default
const delay = D.default
const xs = XS.Stream

const iterations = 5

const counters = {
    todo: 0
}

function getId (type) {
    return counters[type]++
}

function todo () {
    return {
        id: getId('todo'),
        text: 'Lorem ipsum',
        time: new Date()
    }
}
const ping$ = xs.create({
    start: function (listener) {
        setTimeout(() => {
            ;[...Array(iterations).keys()].forEach(i => listener.next(i))
        }, 1)
    },

    stop: function () {
        clearInterval(this.id)
    }
})

const todo$ = ping$.map(todo)

const old$ = todo$.filter(todo => todo.id % 4 === 0).startWith({})

const sample$ = sampleCombine(old$)(todo$)
    .map(([last, old]) => ({
        ...last,
        old
    }))
    .debug('sample$')

sample$.addListener({
    next: () => {},
    error: console.error,
    complete: () => {}
})
