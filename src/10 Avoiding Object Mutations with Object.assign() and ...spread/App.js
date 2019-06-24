import expect from 'expect';
import deepFreeze from 'deep-freeze';

const App = () => {
  //**********************************/
  //*****  REDUX By Dan Abramov  *****/
  //**********************************/

  const toggleTodo = todo => {
    /** mutable version */
    // todo.completed = !todo.completed;
    // return todo;

    /** Immutable version 1*/
    // return Object.assign({}, todo, { completed: !todo.completed });

    /** Immutable version 2 */
    return {
      ...todo,
      completed: !todo.completed,
    };
  };

  const testToggleTodo = () => {
    const todoBefore = {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    };
    const todoAfter = {
      id: 0,
      text: 'Learn Redux',
      completed: true,
    };

    deepFreeze(todoBefore);
    expect(toggleTodo(todoBefore)).toEqual(todoAfter);
  };

  testToggleTodo();
  console.log('All tests passed!');

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;
