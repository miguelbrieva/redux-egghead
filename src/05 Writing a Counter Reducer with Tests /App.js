import expect from 'expect';

const App = () => {
  //**********************************/
  //*****  REDUX By Dan Abramov  *****/
  //**********************************/

  const counter = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  };

  expect(counter(0, { type: 'INCREMENT' })).toEqual(1);
  expect(counter(1, { type: 'DECREMENT' })).toEqual(0);
  expect(counter(1, { type: 'SOMETHING_ELSE' })).toEqual(1);
  console.log('Test passed!');

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;
