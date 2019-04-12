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
  const state = [];

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
    console.log('Output: ', state);
  }
};

// Parse the input file
const parseFile = file => {
  return file.intervals;
};

const addInterval = (target, state) => {
  if (state.length > 0) {
    const pos = getPosition(target, state);
    return state;
  }

  const { start, end } = target;
  const firstInterval = {
    start,
    end,
    subintervals: [[start, end]]
  };
  return [firstInterval];
};

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

// FIXME: Don't modify state
const addToState = (pos, target, state) => {
  const { start, end } = target;
  const { startIndex, startIsIn, endIndex, endIsIn } = pos;
  let nextState;

  console.log(pos);

  if (startIndex === endIndex) {
    if (!startIsIn && !endIsIn) {
      const front = state.slice(0, startIndex);
      const back = state.slice(startIndex);
      newInterval = {
        start,
        end,
        subintervals: [[start, end]]
      };
      nextState = [...front, newInterval, ...back];
    } else if (startIsIn && endIsIn) {
      nextState = [...state];
      nextState[startIndex].subintervals = [
        ...nextState[startIndex].subintervals,
        [start, end]
      ];
    }
  }
  return nextState;
};

// main(f, d);

testTarget = {
  start: 21,
  end: 29
};

testState = [
  new StateElement(0, 9, [[0, 1], [0, 9]]),
  new StateElement(20, 30, [[20, 30]]),
  new StateElement(35, 50, [[35, 50]])
];

console.log(
  JSON.stringify(
    addToState(getPosition(testTarget, testState), testTarget, testState),
    null,
    2
  )
);

// console.log(JSON.stringify(testState, null, 2));
