/* 
  Declare the main function parameters here
    f: input file
    d: merge distance
*/

const f = require('./test1');
const d = 3;

const main = (file, distance) => {
  const { intervals } = file; // Parse input file here
  let state = [];

  // --- Function definitions ---
  const addToState = interval => {
    const { start, end } = interval;
    if (state.length === 0) {
      state.push({ start, end });
    } else {
      let i = 0;
      while (i < state.length && start > state[i].start) {
        i++;
      }
      if (i < state.length && start === state[i].start) {
        while (i < state.length && end > state[i].end) {
          i++;
        }
      }
      state.splice(i, 0, { start, end });
    }
  };

  const removeFromState = interval => {
    const { start, end } = interval;
    const removeIndex = state.findIndex(
      el => el.start === start && el.end === end
    );
    if (removeIndex > -1) {
      state.splice(removeIndex, 1);
    }
  };

  const deleteFromState = interval => {
    const { start, end } = interval;
    const newIntervals = state.filter(el => start >= el.start && end <= el.end);

    newIntervals.forEach(el => {
      removeFromState(el);
      const leftSide = { start: el.start, end: start };
      leftSide.start !== leftSide.end && addToState(leftSide);
      const rightSide = { start: end, end: el.end };
      rightSide.start !== rightSide.end && addToState(rightSide);
    });
  };

  const mergeState = d => {
    let output = [];
    let i = 0;
    while (i < state.length) {
      const { start } = state[i];
      let { end } = state[i];
      while (i < state.length - 1 && state[i + 1].start <= end + d) {
        end = Math.max(end, state[i + 1].end);
        i++;
      }
      output.push(`[${[start, end]}]`);
      i++;
    }
    return output;
  };

  // --- Process the input file ---
  for (let interval of intervals) {
    switch (interval.action) {
      case 'ADDED':
        addToState(interval);
        break;
      case 'REMOVED':
        removeFromState(interval);
        break;
      case 'DELETED':
        deleteFromState(interval);
        break;
      default:
        throw new Error(
          `Invalid interval action at arrival time: ${interval.arrivalTime}`
        );
    }

    const output = mergeState(distance);
    console.log(`
      ${interval.action}: [${[
      interval.start,
      interval.end
    ]}] --> OUTPUT: ${output}
      `);
  }
};

main(f, d);
