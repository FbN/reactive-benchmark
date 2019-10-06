import R from 'rxjs'
import RO from 'rxjs/operators'

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
        text: 'Lorem ipsum'
    }
}

// const ping$ = R.from([...Array(iterations).keys()])

const ping$ = new R.Observable(listener => {
    setTimeout(() => {
        ;[...Array(iterations).keys()].forEach(i => listener.next(i))
    }, 1)
})

const todo$ = RO.share()(RO.map(todo)(ping$))

const old$ = RO.startWith({})(RO.filter(todo => todo.id % 4 === 0)(todo$))

const sample$ = RO.map(([last, old]) => ({
    ...last,
    old
}))(RO.withLatestFrom(old$)(todo$))

const list$ = RO.scan((list, item) => [...list, item], [])(sample$)

const end$ = RO.take(1)(RO.filter(list => list.length === iterations)(list$))

const lists$ = RO.tap(res => console.log)(end$)

lists$.subscribe(console.log)
