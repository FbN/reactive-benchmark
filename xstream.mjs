import XS from 'xstream'
import FC from 'xstream/extra/flattenConcurrently'
import SC from 'xstream/extra/sampleCombine'
import config from './config.mjs'

const flattenConcurrently = FC.default
const sampleCombine = SC.default
const xs = XS.Stream

const batch$ = xs.never()
const induce = ev => batch$.shamefullySendNext(ev)

const counters = {
    todo: 0
}

function getId (type) {
    return counters[type]++
}

function todo () {
    return {
        id: getId('todo'),
        text: 'Lorem ipsum'
    }
}

function todoList (deferred) {
    const ping$ = xs.create({
        start: function (listener) {
            setTimeout(() => {
                ;[...Array(config.iterations).keys()].forEach(i =>
                    listener.next(i)
                )
            }, 0)
        },

        stop: function () {}
    })

    const todo$ = ping$.map(todo)

    const old$ = todo$.filter(todo => todo.id % 4 === 0).startWith({})

    const sample$ = sampleCombine(old$)(todo$).map(([last, old]) => ({
        ...last,
        old
    }))

    const list$ = sample$.fold((list, item) => [...list, item], [])

    const end$ = list$.filter(list => list.length === config.iterations).take(1)

    return end$.map(res => deferred.resolve(res))
}

const lists$ = flattenConcurrently(batch$.map(todoList))

lists$.addListener({
    next: () => {},
    error: console.error,
    complete: () => {}
})

export { induce }
