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

  const store = createStore(todoApp);

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
      this.unsubscribe = store.subscribe(() => 
        this.forceUpdate()
      )
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      const props = this.props
      const state = store.getState()

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

  const Footer = () => (
    <p>
      Show:
      {' '}
      <FilterLink filter='SHOW_ALL' >
        All
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_ACTIVE' >
        Actives
      </FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED' >
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

  const AddTodo = ({onAddClick}) => {
    let input
    return (
      <div>
        <input
          ref={node => input = node}
        />
        <button
          onClick={() => {
            onAddClick(input.value)
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

  let nextTodoId = 0;
  const TodoApp = ({ todos, visibilityFilter }) => (
    <div>
      <AddTodo
        onAddClick={text => 
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text
          })
        }
      />
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter )}
        onTodoClick={ id => store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })}
        />
      <Footer />
    </div>
  );

  const render = () => {
    ReactDOM.render(
      <TodoApp
      {...store.getState()}
      />,
      document.getElementById('root')
    );
  };
  store.subscribe(render);
  render();

  //*****  End REDUX By Dan Abramov  *****/
};

export default App;


/*

00:00 In the previous lesson, we separated the presentational components from the main container component. The to-do app specifies the behaviors, which is what happens when add button, how the to-dos are selected, what happens when a single to-do is being clicked, and what happens when a footer link is clicked.

00:19 The components, such as at to-do, the to-do list, the to-do itself, the footer, and the filter link, they don't dispatch actions. They call their callbacks in the props. They are only responsible for the looks but not for the behavior.

00:39 The downside of this approach is that I have to pass a lot of props down the tree even when the intermediate components don't really use them.

00:48 For example, the filter link needs to know the current filter so that it can choose a different appearance when it is active. However, in order to receive the current filter, it has to be passed down from the top. This is why the footer has to accept visibility filter as a prop, so it can pass it down as a current filter to the filter link.

01:10 In a way, this breaks encapsulation because the parent components need to know too much about what data the child components need. To solve this, we're going to extract a few more container components, just like we extracted the presentation components in the previous lesson.

01:29 The first component I'm going to refactor is the footer component. Currently, it accepts two props -- the visibility filter, and the on filter click callback. But it doesn't actually use either of them. It just passes them down to the filter link. This seems like a good opportunity for simplification.

01:50 We can only do this because we know that the footer component doesn't care about the values of these props. They only exist to be passed down to the filter link that cares about them.

02:01 I am removing the props definition, and I'm removing these props from the filter link usage. It might start to seem a lot like the the code before separating the presentational component. However, what I want to here is a little bit different.

02:19 The filter link does not currently specify the behavior for clicking on the link. It also needs the current filter to tell whether it should be rendered as active.

02:30 Therefore, it's a bit dishonest to say that filter link is a presentational component because it is inseparable from its behavior. The only reasonable reaction to clicking on it is setting the visibility filter by dispatching an action.

02:46 This is why I'm changing it to a different presentational component I'm going to call, "link." I will create another filter link component as a container that uses it for rendering. The link component doesn't know anything about the filter. It only accepts the active prop, and it calls its own click handler. It is only concerned with rendering.

03:10 However, I'm also creating another component, called, "filter link." It is going to be a class this time that is going to render the link with the current data from this chore. It's going to read the component props, and it's going to read the state. But I don't mean react state. I mean the Redux chore state it gets by calling, "store get state."

03:33 As a container component, the filter link doesn't have its own markup. It delegates rendering to the link presentational component. In this case, it calculates its active prop by comparing its own filter prop with the visibility filter in the Redux chore state. The filter prop is the one that is passed to the filter link from the footer. The visibility filter corresponds to the currently chosen visibility filter that is held in Redux chore state. If they match, we want the link to appear active.

04:09 The container component also needs to specify the behavior. In this case, the filter link specifies that when this particular link is clicked, we should dispatch the action with the type set visibility filter and the filter value that we take from the props.

04:27 The filter link may accept children which are used as the contents of the link, so we're going to pass the children down to the link component. We're just going to render them inside the A tack.

04:39 There is a small problem with this implementation of filter link. Inside the render map, it reads the current state of the Redux store. However, it does not subscribe to the store. If the parent component does not update when the store is updated, it's going to render this tail value.

04:58 Currently, we rearrange the whole application when the state changes. However, this is not very efficient. In future, we will instead move subscription to the store, to the lifecycle methods of the container components.

05:14 React provides a special force update method on the component instances to force their re-rendering. We're going to use it together with store subscribe method so that any time the store state changes, we force update the container components.

05:30 We perform the subscription inside the component if mount lifecycle method. So it's important to unsubscribe inside the component will unmount method. Note that we don't actually have the unsubscribe function, but this is the return value of the store subscribe method, so we can keep it, and then call it inside component will unmount.

05:54 Let's recap this part. The filter link component subscribes to this chore, calling force update any time this chore changes so it can render the current state of this chore. It saves the reference through the unsubscribe function returned by store subscribe. It invokes it when the component is about to unmount to clean up the subscription.

06:17 Let's recap the relationship between the filter link container component and the link presentational component. The link component only specifies the appearance of the the link, when it is active or inactive, but it doesn't know about the behavior. The filter link component is a container, so it provides the data and the behavior for the presentational component.

06:43 When it mounts, it subscribes to this chore, so it independently re-renders when the store state changes because it needs to use this chore current state inside its render method.

06:55 Instead of specifying the DOM tree, it delegates all the rendering to the link presentational component. Its only job is to calculate the props based on the filter link's own props and the current state of the Redux chore. It also specifies the callbacks that are going to dispatch the actions on this chore.

07:17 After the action is dispatched, this chore will remember the new state returned by the reducer and will call every subscriber to this chore. In this case, every filter link component instance is subscribed to this chore, so they will all have their force update methods called on them. They will re-render according to the current chore state.

07:41 The filter link is a container component, so it is completely self-sufficient and can be used inside the presentational components, such a footer, without passing additional props to get the data from this chore and specify the behavior. This lets us keep the footer component simple and decoupled from the behavior and the data that its child components need.

*/