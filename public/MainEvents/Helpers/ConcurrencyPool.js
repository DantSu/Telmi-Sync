import * as os from 'os'

const
  getWorkerCount = () => {
    const n = os.cpus().length
    return n > 0 ? n : 1
  },

  // Runs `total` tasks (indexed 0..total-1) through `worker`, keeping up to
  // getWorkerCount() of them in flight at once. A task's rejection is
  // swallowed so the pool keeps going, mirroring the previous sequential
  // recursion's error handling. `onItemSettled(settledCount)` fires each
  // time a task finishes (success or failure), in completion order.
  runConcurrentPool = (total, worker, onItemSettled) => {
    return new Promise((resolve) => {
      if (total <= 0) {
        resolve()
        return
      }

      const concurrency = Math.min(getWorkerCount(), total)
      let nextIndex = 0
      let settledCount = 0

      const runNext = () => {
        if (nextIndex >= total) {
          return
        }
        const i = nextIndex++
        worker(i)
          .catch(() => {})
          .then(() => {
            settledCount++
            if (typeof onItemSettled === 'function') {
              onItemSettled(settledCount)
            }
            if (settledCount === total) {
              resolve()
            } else {
              runNext()
            }
          })
      }

      for (let k = 0; k < concurrency; k++) {
        runNext()
      }
    })
  }

export {getWorkerCount, runConcurrentPool}
