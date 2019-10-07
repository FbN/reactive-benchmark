// import fs from 'fs'
import { spawnSync } from 'child_process'
import config from '../config.mjs'

const types = ['most', 'rxjs', 'xstream']
try {
    types
        .map(type =>
            spawnSync(
                process.argv[0],
                [
                    '--experimental-modules',
                    '--expose-gc',
                    './memory/runner.mjs',
                    type,
                    config.iterations
                ],
                { stdio: 'inherit' }
            )
        )
        .map(console.log)
} catch (e) {
    console.error()
} finally {
    process.exit()
}
