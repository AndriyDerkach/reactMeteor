import React, {useRef, useState} from 'react';
import Task from './Task';
import {useTracker} from "meteor/react-meteor-data";
import {Tasks} from "../api/tasks";

export const App = () => {
    const input = useRef(null);
    const [hideCompleted, setHideCompleted] = useState(false);
    const {tasks, incompleteCount} = useTracker(() => ({
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    }));
    const renderTasks = () => {
        let filteredTask = tasks;
        if (hideCompleted) {
            filteredTask = tasks.filter(elem => !elem.checked);
        }
        return filteredTask.map((task) => (
            <Task key={task._id} task={task} />
        ));
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        // Find the text field via the React ref
        const text = input.current.value.trim();

        Tasks.insert({
            text,
            createdAt: new Date(), // current time
        });

        // Clear form
        input.current.value = '';
    };
    const toggleHideCompleted = () => setHideCompleted(!hideCompleted);
  return (
      <div className="container">
          <header>
              <h1>Todo List ({incompleteCount})</h1>
              <label className="hide-completed">
                  <input
                      type="checkbox"
                      readOnly
                      checked={hideCompleted}
                      onClick={toggleHideCompleted}
                  />
                  Hide Completed Tasks
              </label>
              <form className="new-task" onSubmit={handleSubmit} >
                  <input
                      type="text"
                      ref={input}
                      placeholder="Type to add new tasks"
                  />
              </form>

          </header>

          <ul>
              {renderTasks()}
          </ul>
      </div>
  )
};
