# Coding assignment

My final solution is written in JavaScript and can be found in the `index.js` file. Some test files in JSON format are also included.

### Usage

The simplest way to run the code is by using the [Node.js](https://nodejs.org/en/) environment. Open up a terminal at the root of the folder and type `node index`. The output will appear on the console.

All the necessary funcionality is included in the `main()` function. Its parameters - the _input file_ and the _merge distance_ - can be changed at the top of the `index.js` file.

Test files in other format (e.g. CSV) need to be parsed to an _array of objects_ at the top of the `main()` function, where each object must have an `arrivalTime`, `start`, `end` and an `action` field.

##### Note

To keep the code simple I omitted a validation step to check whether for all intervals in the input file `start < end` stands. It was assumed during testing.

### How it works

The `main()` function first creates an empty `state` _array_ and defines functions to modify it. The inner functions `addToState()`, `removeFromState()` and `deleteFromState()` all take one _interval object_ as their input and (possibly) alter the `state` as a _side effect_.

The output is computed by the `mergeState()` function given a _merge distance_. This function runs in every step regardless whether the `state` was changed.

### Deleting an interval

When an interval `[a, b]` is signed for deletion the `deleteFromState()` first finds all the intervals in `state` that contain `[a, b]`. These intervals are then removed from `state` and replaced by the interval differences that remain after deletion.

##### Caveats

- Only _subsets_ of the intervals in the current `state` can be deleted. If an interval-to-be-deleted intersects with another one in the `state`, but is not fully contained in it, no deletion will take place
- If parts of an interval is deleted later the _original_ interval cannot be removed as a whole
- Upon deletion the remaining parts of an interval will appear as distinct elements in the `state` however the _merge distance_ can be such that the action won't have any visible effects in the output

### On efficiency

This method computes the output in every step. I chose this approach since it was the easiest to implement however it can get slow as the `state` grows.

A better way would be to store the output separately and only _update_ the relevant parts of it when adding, removing or deleting an interval.
