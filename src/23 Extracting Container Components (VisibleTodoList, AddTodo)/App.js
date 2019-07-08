import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

const App = () => {

  //*****  REDUX By Dan Abramov  *****/

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

  const todoApp = combineReducers({
    todos,
    visibilityFilter,
  });

  const Link = ({ active, children, onClick }) => {
    if(active) {
      return <span>{children}</span>
    }
    return (
      <a href='#'
        onClick={e => {
          e.preventDefault();
          onClick()
        }}
      >
        {children}
      </a>
    );
  };

  class FilterLink extends Component {
    componentDidMount() {
      const { store } = this.props;
      
      this.unsubscribe = store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const props = this.props;
      const { store } = props;
      const state = store.getState();

      return (
        <Link 
          active={props.filter === state.visibilityFilter}
          onClick={() => 
            store.dispatch({
              type: 'SET_VISIBILITY_FILTER',
              filter: props.filter
            })
          }
        >
          {props.children}
        </Link>
      )
    }
  }

  const Footer = ({ store }) => (
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
        store={store}
      >
        All
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'
        store={store}
      >
        Actives
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'
        store={store}
      >
        Completed
      </FilterLink>
    </p>
  )

  const Todo = ({ onClick, completed, text }) => (
    <li
      onClick={onClick}
      style={{ textDecoration: completed ? 'line-through' : 'none' }}
    >
      {text}
    </li>
  )

  const TodoList = ({ todos, onTodoClick }) => (
    <ul>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
      ))}
    </ul>
  )

  const AddTodo = ({ store }) => {
    let input
    return (
      <div>
        <input
          ref={node => input = node}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: 'ADD_TODO',
              id: nextTodoId++,
              text: input.value
            })
            input.value = ''
          }}
        >
          Add Todo
        </button>
      </div>
    )
  }

  const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }

  class VisibleTodoList extends Component {
    componentDidMount() {
      const { store } = this.props;
      this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
      this.unsubscribe();
    }
    render() {
      const props = this.props;
      const { store } = props
      const state = store.getState();
      return (
        <TodoList
          todos={ getVisibleTodos(state.todos, state.visibilityFilter) }
          onTodoClick={id => 
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
          }
        />
      )
    }
  }

  let nextTodoId = 0;
  const TodoApp = ({ store }) => (
    <div>
      <AddTodo store={store} />
      <VisibleTodoList store={store} />
      <Footer store={store} />
    </div>
  );

  ReactDOM.render(
    <TodoApp store={createStore(todoApp)} />,
    document.getElementById('root')
  );

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;

/*
00:00 In the previous lesson, I separated the Link presentational component from the FilterLink container component that is subscribed to the Redux store and that provides the data and the behavior for the Link component it renders.

00:14 While it makes the data flow a little bit less explicit, it makes it easy to use FilterLink in any component without worrying about passing additional data to the FilterLink or to the component that contains it. In this lesson we'll continue extracting the container components from the top level container component. The first candidate is the TodoList component.

00:39 I actually want to keep the TodoList presentational component. However, I want to encapsulate within the currently visibleTodos this into a separate container component that connects the TodoList to the Redux store. I'm going to call this component the VisibleTodoList.

00:59 Just like when declaring the FilterLink component in the previous lesson, I calculate the data from the current component by using the current state which is the state from the Redux store. I'm using the getVisibleTodos() function to calculate the currently visibleTodos based on all the Todos from the Redux store and the current visibility filter from the Redux store state. I'm specifying the behavior as well. I'm seeing that when the ToDo is clicked, we should dispatch an action with the type TOGGLE_TODO and the ID of the ToDo being clicked.

01:36 All container components are similar. Their job is to connect a presentational component to the Redux chore and specify the data and the behavior that it needs. I'm scrolling up to the filter link container component I wrote in the previous lesson to copy-paste the store subscription logic.

01:57 Just like the filter link, the visible ToDoList is going to subscribe to the store and force an update any time the store state changes because it uses this state in its render method. Now that the visible ToDoList is connected to the Redux chore, we can use it instead of the TodoList. We no longer have to pass all the props from the top.

02:19 Finally, in the previous lesson, I made app ToDo a presentational component, but I'm going to backtrack on this now. I will copy-paste the dispatch call back in line into the onClick handler inside the component because there isn't really a lot of presentation or behavior here.

02:39 It's easier to keep them together until we figure out how to split the presentation. For example, if in the future, we're going to have something like a form component, we may split it, but for now we'll keep them together.

02:51 I'm scrolling down to my ToDo app component. I'm removing the onAuth click prop. I just noticed that none of the containers actually need any props from this street. I can remove the props of the ToDo app component. I can remove the render function that renders the ToDo app component with the current street of the store because I can just call it once, remove all the props that are related to this state and just render it as is because the container components that I render are going to subscribe to the store themselves and are going to update themselves when the store state changes.

03:33 Let's recap the data flow after separating the presentational and the container components. There is just one react on render call at the very end. We don't render again when the store state changes because the container components take care of that.

03:50 The first component I'm looking at is called AddTodo. Frankly, I can classify it either as a presentational component or as a container component because it doesn't fit either category. The input and the button are the presentational part, but dispatching an action onClick is the behavior which is usually specified by the container.

04:13 However, in this case, I'd rather keep them together because there isn't any street, the UI is very simple. It's hard to imagine any other behavior other than dispatching the ADD_TODO action.

04:28 The second component are rendering inside the at To-Do app is called the VisibleTodoList. This time, it is a proper container component that subscribes to the store and re-renders the ToDoList any time the store state changes. It calculates the visible ToDos from the current Redux store state, the ToDos and the visibility filter fields. It passes them as the To-Dos.

04:54 When the To-Dos are clicked, it's going to dispatch an action with the type inaudible ToDo and the ID of the respective ToDo. The actual rendering here is performed by the ToDoList component that just renders the ToDos passed through it as prop and binds their clicks through the on ToDo click prop.

05:14 Finally, the last component ToDo app renders is the footer. The footer is just a presentational component rendering three different filter links. The filter link is a container component. It subscribes to the store and it renders the presentational component called, "link," calculating whether it should be active based on its props and the current Redux store state and specifies the behavior what happens when it's clicked.

05:45 Finally, the link component is just a presentational component that render a-check. Separating the container and the presentational components is often a good idea, but you shouldn't take it as a dogma. Only do this when it truly reduces the complexity of your code base.

06:04 In general, I suggest first trying to extract the presentational components. If there is too much boilerplate passing the props through them, then you can create the containers around them that load the data and specify the behavior
*/