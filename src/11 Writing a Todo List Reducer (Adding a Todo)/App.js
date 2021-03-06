import expect from 'expect';
import deepFreeze from 'deep-freeze';

const App = () => {
  //**********************************/
  //*****  REDUX By Dan Abramov  *****/
  //**********************************/

  const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            id: action.id,
            text: action.text,
            completed: false,
          },
        ];
      default:
        return state;
    }
  };

  const testAddTodo = () => {
    const stateBefore = [];
    const action = {
      type: 'ADD_TODO',
      id: 0,
      text: 'Learn Redux',
    };
    const stateAfter = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false,
      },
    ];
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(todos(stateBefore, action)).toEqual(stateAfter);
  };

  testAddTodo();
  console.log('All tests passed.');

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;
