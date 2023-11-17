import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Dropdown,
  Field,
  Input,
  Option,
  Radio,
  Spinner,
} from "@fluentui/react-components";
import Breadcrumbs from "./Breadcrumbs";
import "./TodoEdit.css";

function TodoEdit({ todosData, updateTodo }) {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState({
    title: "",
    completed: false,
    userId: null,
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTitleValid, setIsTitleValid] = useState(true);

  // useEffect(() => {
  //   const fetchTodo = async () => {
  //     try {
  //       const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
  //       setTodo(response.data);
  //       setLoading(false);
  //     } catch (todoError) {
  //       setError("No Data Found!");
  //       setLoading(false);
  //     }
  //   };

  //   fetchTodo();

  // }, [todoId]);

  useEffect(() => {
    const todoToEdit = todosData.find((t) => t.id === parseInt(todoId));
    if (todoToEdit) {
      setTodo(todoToEdit);
      setStatus(todoToEdit.completed ? "completed" : "incomplete");
      setLoading(false);
    } else {
      setError("No Data Found!");
      setLoading(false);
    }
  }, [todoId, todosData]);

  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        setUser(response.data);
      } catch (userError) {
        setError("No Data Found!");
        setLoading(false);
      }
    };

    if (todo.userId) {
      fetchUser(todo.userId);
    }
  }, [todo.userId]);

  useEffect(() => {
    setStatus(todo.completed ? "completed" : "incomplete");
  }, [todo.completed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setIsTitleValid(value.trim().length > 0);
    }

    if (name === "status") {
      setStatus(value);
      setTodo({
        ...todo,
        completed: value === "completed",
      });
    } else {
      setTodo({
        ...todo,
        [name]: value,
      });
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setIsTitleValid(value.trim().length > 0);
    }
  };

  const handleSave = () => {
    updateTodo({
      ...todo,
      completed: status === "completed",
    });
    navigate("/todos");
  };

  return (
    <div className="todo-edit">
      <div className="edit-bread">
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
        <div className="todo-edit-body">
          <div>
            <Field
              label="Title"
              required
              validationMessage={!isTitleValid && "Title is required."}
            >
              <Input
                type="text"
                name="title"
                value={todo.title}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
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
                checked={status === "completed"}
                onChange={handleInputChange}
              />
              <label htmlFor="completed">Completed</label>
            </div>
            <div>
              <Radio
                id="incomplete"
                name="status"
                value="incomplete"
                checked={status === "incomplete"}
                onChange={handleInputChange}
              />
              <label htmlFor="incomplete">Incomplete</label>
            </div>
          </div>
          <div>
            <label>User</label>
            <div className="dropdown">
              <Dropdown name="user" value={user ? user.name : ""} disabled>
                {user && (
                  <Option key={user.id} value={user.name}>
                    {user.name}
                  </Option>
                )}
              </Dropdown>
            </div>
          </div>
          <div className="edit-btn">
            <Button
              onClick={handleSave}
              appearance="primary"
              disabled={!isTitleValid}
            >
              Save
            </Button>
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
