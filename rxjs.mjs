import R from 'rxjs'
import RO from 'rxjs/operators'

const batch$ = new R.Subject()

const induce = function (ev) {
    batch$.next(ev)
}

const iterations = 1000

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

function todoList (deferred) {
    const ping$ = R.from([...Array(iterations).keys()])

    const todo$ = RO.map(todo)(ping$)

    const old$ = RO.startWith({})(RO.filter(todo => todo.id % 4 === 0)(todo$))

    const sample$ = RO.map(([last, old]) => ({
        ...last,
        old
    }))(RO.withLatestFrom(old$)(todo$))

    const list$ = RO.scan((list, item) => [...list, item], [])(sample$)

    const end$ = RO.take(1)(
        RO.filter(list => list.length === iterations)(list$)
    )

    return RO.tap(res => deferred.resolve(res))(end$)
}

const lists$ = RO.mergeAll()(RO.map(todoList)(batch$))

lists$.subscribe(() => {})

export { induce }
