import XS from 'xstream'
import FC from 'xstream/extra/flattenConcurrently'
import SC from 'xstream/extra/sampleCombine'
import D from 'xstream/extra/delay'

const flattenConcurrently = FC.default
const sampleCombine = SC.default
const delay = D.default
const xs = XS.Stream

const batch$ = xs.never()
const induce = ev => batch$.shamefullySendNext(ev)

const iterations = 1000
// const period = 1

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

    const list$ = sample$.fold((list, item) => [...list, item], [])

    const end$ = list$.filter(list => list.length === iterations).take(1)

    ;[...Array(iterations).keys()].forEach(i => ping$.shamefullySendNext(i))

    return end$.map(res => deferred.resolve(res))
}

const lists$ = flattenConcurrently(batch$.map(todoList))

lists$.addListener({
    next: () => {},
    error: console.error,
    complete: () => {}
})

export { induce }
