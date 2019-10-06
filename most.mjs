import M from '@most/core'
import MS from '@most/scheduler'
import MA from '@most/adapter'
import FA from 'most-from-array'

const fromArray = FA.fromArray

const { createAdapter } = MA

const [induce, batch$] = createAdapter()

const {
    multicast,
    tap,
    scan,
    map,
    runEffects,
    join,
    filter,
    startWith,
    snapshot,
    take,
    delay
} = M

const { newDefaultScheduler } = MS

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
    // const ping$ = take(iterations, periodic(period))

    const ping$ = fromArray([...Array(iterations).keys()])

    const todo$ = multicast(map(todo, ping$))

    const old$ = filter(todo => todo.id % 4 === 0, todo$)

    const sample$ = snapshot(
        (old, last) => ({
            ...last,
            old
        }),
        old$,
        todo$
    )

    const list$ = scan((list, item) => [...list, item], [], sample$)

    const end$ = take(1, filter(list => list.length === iterations, list$))

    return tap(res => deferred.resolve(res), end$)
}

const lists$ = join(map(todoList, batch$))

runEffects(lists$, newDefaultScheduler())

export { induce }
