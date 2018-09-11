const readline = require("readline");
const fs = require("fs");

/**
 * @param {string} line
 */
function resolveLine(line) {
  return line.split(" ").filter(item => item !== "").map(value => Number(value));
}

function readGraph(resource) {
  return new Promise((resolve, reject) => {
    const graph = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(resource),
      crlfDelay: Infinity
    });

    rl.on("line", line => {
      if (graph.length < 2) {
        graph.push(line);
      } else {
        graph.push(resolveLine(line));
      }
    });

    rl.on("close", () => {
      resolve(graph);
    });
  });
}

function readLine(resource) {
  return new Promise((resolve, reject) => {
    const graph = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(resource),
      crlfDelay: Infinity
    });

    rl.on("line", line => {
      graph.push(line);
    });

    rl.on("close", () => {
      resolve(graph);
    });
  });
}

module.exports = {
  readGraph,
  readLine
};
