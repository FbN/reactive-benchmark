import csvWriter from 'csv-writer'

const typeWriter = type =>
    csvWriter.createObjectCsvWriter({
        path: '.tmp/memory_' + type + '.csv',
        header: [
            { id: 'gc_ts', title: 'gc_ts' },
            { id: 'gcScavengeCount', title: 'gcScavengeCount' },
            { id: 'gcScavengeTime', title: 'gcScavengeTime' },
            { id: 'gcMarkSweepCompactCount', title: 'gcMarkSweepCompactCount' },
            { id: 'gcMarkSweepCompactTime', title: 'gcMarkSweepCompactTime' },
            {
                id: 'gcIncrementalMarkingCount',
                title: 'gcIncrementalMarkingCount'
            },
            {
                id: 'gcIncrementalMarkingTime',
                title: 'gcIncrementalMarkingTime'
            },
            {
                id: 'gcProcessWeakCallbacksCount',
                title: 'gcProcessWeakCallbacksCount'
            },
            {
                id: 'gcProcessWeakCallbacksTime',
                title: 'gcProcessWeakCallbacksTime'
            },
            { id: 'total_heap_size', title: 'total_heap_size' },
            {
                id: 'total_heap_size_executable',
                title: 'total_heap_size_executable'
            },
            { id: 'total_physical_size', title: 'total_physical_size' },
            { id: 'total_available_size', title: 'total_available_size' },
            { id: 'used_heap_size', title: 'used_heap_size' },
            { id: 'heap_size_limit', title: 'heap_size_limit' },
            { id: 'malloced_memory', title: 'malloced_memory' },
            { id: 'peak_malloced_memory', title: 'peak_malloced_memory' },
            { gc_time: 'gc_time' }
        ]
    })

export { typeWriter }
