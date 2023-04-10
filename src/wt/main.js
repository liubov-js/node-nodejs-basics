import path from "path";
import { cpus } from "os";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

const performCalculations = async () => {
  const START_NUMBER = 10;
  const STATUS_RESOLVED = "resolved";
  const STATUS_ERROR = "error";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const workerPath = `${__dirname}/worker.js`;

  const createWorker = (workerData) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, { workerData: workerData });
      worker.on('message', (data) => resolve({ status: STATUS_RESOLVED, data }));
      worker.on('error', () => reject({ status: STATUS_ERROR }));
      worker.postMessage(workerData);
    });
  };

  const promises = cpus().map((cpu, i) => { return createWorker(START_NUMBER + i )});

  await Promise.all(promises).then((results) => {
    console.log(results);
  });
};

await performCalculations();