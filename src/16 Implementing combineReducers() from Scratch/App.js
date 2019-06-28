import { createStore } from 'redux';

const App = () => {
  //**********************************/
  //*****  REDUX By Dan Abramov  *****/
  //**********************************/

  const todo = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          id: action.id,
          text: action.text,
          completed: false,
        };
      case 'TOGGLE_TODO':
        if (state.id !== action.id) {
          return state;
        }
        return {
          ...state,
          completed: !state.completed,
        };
      default:
        return state;
    }
  };

  const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [...state, todo(undefined, action)];
      case 'TOGGLE_TODO':
        return state.map(t => todo(t, action));
      default:
        return state;
    }
  };

  const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
      case 'SET_VISIBILITY_FILTER':
        return action.filter;
      default:
        return state;
    }
  };

  const combineReducers = reducers => {
    // El valor retornado en una reducer en si mismo, recibe el estado y la acción como argumentos. Por lo tanto, combineReducer es una función que retorna otro función.
    return (state = {}, action) => {
      // El siguiente método me da todos los keys del objeto reducer: [todos, visibilityFilter]
      return Object.keys(reducers).reduce((nextState, key) => {
        // En la siguiente linea se ejecuta cada reducer y se guarda en nextState.
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      }, {});
    };
  };

  const todoApp = combineReducers({
    todos,
    visibilityFilter,
  });

  const store = createStore(todoApp);

  console.log('Initial state:');
  console.log(store.getState());
  console.log('--------------');

  console.log('Dispatching ADD_TODO');
  store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux',
  });
  console.log('Current state:');
  console.log(store.getState());
  console.log('--------------');

  console.log('Dispatching ADD_TODO');
  store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go shopping',
  });
  console.log('Current state:');
  console.log(store.getState());
  console.log('--------------');

  console.log('Dispatching TOGGLE_TODO');
  store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0,
  });
  console.log('Current state:');
  console.log(store.getState());
  console.log('--------------');

  console.log('Dispatching SET_VISIBILITY_FILTER');
  store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED',
  });
  console.log('Current state:');
  console.log(store.getState());
  console.log('--------------');

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;
