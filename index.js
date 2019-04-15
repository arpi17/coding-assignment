/* 
  Declare the main function parameters here

  f: input file
  d: merge distance
*/

const f = require('./testFile');
const d = 7;

// TODO: Rename this to something better
class StateElement {
  constructor(start, end, subintervals) {
    (this.start = start), (this.end = end), (this.subintervals = subintervals);
  }
}

const main = (file, distance) => {
  const intervals = parseFile(file);
  let state = [];

  for (let interval of intervals) {
    switch (interval.action) {
      case 'ADDED':
        state = addInterval(interval, state);
        break;
      case 'REMOVED':
        state = removeInterval(interval, state);
        break;
      default:
        throw new Error(
          `Invalid interval action at arrival time: ${interval.arrivalTime}`
        );
    }

    const output = state.map(item => `[${[item.start, item.end]}]`);
    console.log(`
      -------------------------------------------------------

      ${interval.action}: [${[interval.start, interval.end]}]

      ${output}`);
  }
};

// Parse the input file
const parseFile = file => {
  return file.intervals;
};

// Add interval and to state and merge it
const addInterval = (target, state) => {
  if (state.length > 0) {
    const nextState = insertToState(target, state);
    return nextState;
  }

  const { start, end } = target;
  const firstInterval = new StateElement(start, end, [[start, end]]);
  return [firstInterval];
};

// Get the position of the target interval to be inserted into state
const getPosition = (target, state) => {
  const { start, end } = target;
  const pos = {};
  let i = state.length;

  // Find the position of the end
  while (i > 0 && end <= state[i - 1].end) {
    i--;
  }
  pos.endIndex = i;
  pos.endIsIn =
    i === state.length ? false : end >= state[i].start ? true : false;

  // Find the position of the start
  while (i > 0 && start <= state[i - 1].end) {
    i--;
  }
  pos.startIndex = i;
  pos.startIsIn =
    i === state.length ? false : start >= state[i].start ? true : false;

  return pos;
};

// Add target interval to state at the correct position and modify them accordingly (no merging)
// FIXME: Don't modify state
const insertToState = (target, state) => {
  const pos = getPosition(target, state);
  const { startIndex, startIsIn, endIndex, endIsIn } = pos;
  const { start, end } = target;
  let nextState;

  if (startIndex === endIndex && startIsIn === endIsIn) {
    if (startIsIn) {
      nextState = [...state];
      nextState[startIndex].subintervals = [
        ...nextState[startIndex].subintervals,
        [start, end]
      ];
    } else {
      const front = state.slice(0, startIndex);
      const back = state.slice(startIndex);
      const newInterval = new StateElement(start, end, [[start, end]]);
      nextState = [...front, newInterval, ...back];
    }
  } else {
    const front = state.slice(0, startIndex);
    const back = state.slice(endIndex + 1);

    // Merge subintervals
    let newSubintervals = [];
    for (let i = startIndex; i <= Math.min(state.length - 1, endIndex); i++) {
      newSubintervals = newSubintervals.concat(state[i].subintervals);
    }
    newSubintervals = newSubintervals.concat([[start, end]]);

    const newInterval = {
      start: startIsIn ? state[startIndex].start : start,
      end: endIsIn ? state[endIndex].end : end,
      subintervals: newSubintervals
    };
    nextState = [...front, newInterval, ...back];
  }
  return nextState;
};

// FIXME: Don't modify state and clean this up
const removeInterval = (target, state) => {
  let nextState = [...state];
  const { start, end } = target;
  const containsTargetInterval = subinterval =>
    subinterval[0] === start && subinterval[1] === end;

  const intervalIndex = state.findIndex(interval =>
    interval.subintervals.some(containsTargetInterval)
  );

  if (intervalIndex > -1) {
    const subintervals = nextState[intervalIndex].subintervals.filter(
      subinterval => !(subinterval[0] === start && subinterval[1] === end)
    );

    if (subintervals.length === 0) {
      return nextState.filter((interval, i) => i !== intervalIndex);
    }

    return nextState;
  } else {
    throw new Error(
      `The interval [${[
        start,
        end
      ]}] is either already removed or has never been added at the first place`
    );
  }
};

// main(f, d);
