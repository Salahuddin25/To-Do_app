import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Dropdown, Field, Input, Option, Radio, Spinner } from "@fluentui/react-components";
import Breadcrumbs from './Breadcrumbs';
import "./TodoEdit.css"

function TodoEdit(props) {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState({ title: '', completed: false, userId: null });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todo data from an API
  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/todos/${todoId}`)
      .then((response) => {
        setTodo(response.data);
        setLoading(false);
      })
      .catch((todoError) => {
        setError("No Data Found");
        setLoading(false);
      });
  }, [todoId]);
  
  // Fetch user data based on todo's userId
  useEffect(() => {
    if (todo.userId) {
      axios
        .get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
        .then((response) => setUser(response.data))
        .catch((todoError) => {
          setError("No Data Found");
          setLoading(false);
        });
    }
  }, [todo.userId]);

  // Update the status based on completed property
  useEffect(() => {
    setStatus(todo.completed ? 'completed' : 'incomplete');
    setLoading(false);
  }, [todo.completed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'status') {
      setStatus(value); 
      setTodo({
        ...todo,
        completed: value === 'completed',
      });
    } else {
      setTodo({
        ...todo,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    navigate("/todos");
    axios
      .put(`https://jsonplaceholder.typicode.com/todos/${todoId}`, todo)
      .then(() => {
        console.log('Edited Todo Details:', todo); 
        props.setTodosData((data) => {
          return [...data, todo]
        });
        navigate("/todos"); 
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className='todo-edit'>
      <div className='edit-bread'>
        <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      {loading ? (
        <Spinner label="Loading..." />
      ) : error ? (
        <div className="error-message-edit">
          <img 
            src="https://static.thenounproject.com/png/4440902-200.png" 
            alt="No Data Found Icon"
            className="error-image-edit"
          />
          {error}
        </div>
      ) : (
        <div className='todo-edit-body'>
          <div>
            <Field label="Title" required>
              <Input
                type="text"
                name="title"
                value={todo.title}
                onChange={handleInputChange}
                style={{ width: "200px" }}
              />
            </Field>
          </div>
          <div>
            <label>Status</label>
            <div>
              <Radio
                id="completed"
                name="status"
                value="completed"
                checked={status === 'completed'}
                onChange={handleInputChange}
              />
              <label htmlFor="completed">Completed</label>
            </div>
            <div>
              <Radio
                id="incomplete"
                name="status"
                value="incomplete"
                checked={status === 'incomplete'}
                onChange={handleInputChange}
              />
              <label htmlFor="incomplete">Incomplete</label>
            </div>
          </div>
          <div>
            <label>User</label>
            <div className='dropdown'>
              <Dropdown name="user" value={user ? user.name : ''} disabled>
                {user && (
                  <Option key={user.id} value={user.name}>
                    {user.name}
                  </Option>
                )}
              </Dropdown>
            </div>
          </div>
          <div className='edit-btn'>
            <Button onClick={handleSave} appearance="primary">Save</Button>
            <Link to="/todos">
              <Button>Cancel</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoEdit;
