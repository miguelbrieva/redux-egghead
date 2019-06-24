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

  const createStore = reducer => {
    let state;
    let listeners = [];

    const getState = () => state;

    // Dispatch an action is the only way to change the initial state
    const dispatch = action => {
      state = reducer(state, action);
      // After the state was updated, we need to notify every changed listener, by calling it.
      listeners.forEach(listener => listener());
    };

    const subscribe = listener => {
      listeners.push(listener);
      return () => {
        listener = listeners.filter(l => l !== listener);
      };
    };
    dispatch({});

    return { getState, dispatch, subscribe };
  };

  const store = createStore(counter);

  const render = () => {
    document.body.innerText = store.getState();
  };
  store.subscribe(render);
  render();

  document.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' });
  });

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;
