// Pause execution of an asynchronous thread to allow other tasks to execute
export function pauseExecution() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 1);
  });
}
