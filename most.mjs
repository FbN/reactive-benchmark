import M from '@most/core'
import MS from '@most/scheduler'
import MA from '@most/adapter'
import FA from 'most-from-array'
import config from './config.mjs'
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
    snapshot,
    take
} = M

const { newDefaultScheduler } = MS

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
    const ping$ = fromArray([...Array(config.iterations).keys()])

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

    const end$ = take(
        1,
        filter(list => list.length === config.iterations, list$)
    )

    return tap(res => deferred.resolve(res), end$)
}

const lists$ = join(map(todoList, batch$))

runEffects(lists$, newDefaultScheduler())

export { induce }
