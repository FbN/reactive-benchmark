import config from './config.mjs'

let counters = 0

function getId (type) {
    return counters++
}

function todo () {
    return {
        id: getId('todo'),
        text: 'Lorem ipsum'
    }
}

function induce (deferred) {
    const list = []
    let old = {}
    for (let i = 0; i < config.iterations; i++) {
        const t = todo()
        old = t.id % 4 === 0 ? { ...t } : old
        t.old = { ...old }
        list.push(t)
    }
    return deferred.resolve(list)
}

export { induce }
