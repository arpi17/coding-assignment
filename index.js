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
    const nextState = addToState(target, state);
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

  // Find the position of the start
  while (i > 0 && start <= state[i - 1].end) {
    i--;
  }
  pos.startIndex = i;
  pos.startIsIn =
    i === state.length ? false : start < state[i].start ? false : true;

  // Find the position of the end
  while (i < state.length && end > state[i].end) {
    i++;
  }
  pos.endIndex = i;
  pos.endIsIn =
    i === state.length ? false : end >= state[i].start ? true : false;

  return pos;
};

// Add target interval to state at the correct position and modify them accordingly (no merging)
// FIXME: Don't modify state
const addToState = (target, state) => {
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

main(f, d);

testTarget = {
  start: 0,
  end: 2
};

testState = [
  new StateElement(0, 9, [[0, 1], [0, 9]]),
  new StateElement(20, 30, [[20, 30]]),
  new StateElement(35, 50, [[35, 50]])
];

// console.log(
//   JSON.stringify(
//     addToState(getPosition(testTarget, testState), testTarget, testState),
//     null,
//     2
//   )
// );

// console.log(JSON.stringify(testState, null, 2));
