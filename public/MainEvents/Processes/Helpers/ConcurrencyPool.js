import * as os from 'os'

const
  getWorkerCount = () => {
    const n = os.cpus().length
    return n > 0 ? n : 1
  },
  concurrency = getWorkerCount(),
  runConcurrentPool = (worker) => {
    return new Promise((resolve) => {
      const runningPool = new Array(concurrency).fill(true)

      const runNext = (idCPU) => {
        runningPool[idCPU] = worker(() => runNext(idCPU))
        if (!runningPool[idCPU] && runningPool.indexOf(true) === -1) {
          resolve()
        }
      }

      for (let k = 0; k < concurrency; k++) {
        runNext(k)
      }
    })
  }

export {runConcurrentPool}
