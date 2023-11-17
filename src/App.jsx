import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import axios from "axios";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import TodoDetails from "./components/TodoDetails";
import TodoEdit from "./components/TodoEdit";
import ErrorPage from "./components/ErrorPage";
import TodoCard from "./components/TodoCard";
import "./App.css";

initializeIcons();

function App() {
  const [todosData, setTodosData] = useState([]);
  const [users, setUsers] = useState({});
  const [newTodoAdded, setNewTodoAdded] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const usersData = response.data.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
        setUsers(usersData);
      })
      .catch((error) => console.error("Error fetching users", error));
  }, []);

  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodosData(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Error parsing todos from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todosData));
  }, [todosData]);

  function handleNewTodo() {
    setNewTodoAdded(true);
  }

  useEffect(() => {
    if (newTodoAdded) {
      setTimeout(() => {
        setNewTodoAdded(false);
      }, 2400);
    }
  }, [newTodoAdded]);

  function updateTodo(updatedTodo) {
    setTodosData((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }
        return todo;
      });
    });
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route index path="/" element={<TodoCard />} />
          <Route
            path="/todos"
            element={
              <TodoList setTodosData={setTodosData} users={users} todosData={todosData} newTodoAdded={newTodoAdded} />
            }
          />
          <Route
            path="/todos/add"
            element={<AddTodo setTodosData={setTodosData} todosData={todosData}  users={users} setUsers={setUsers} onNewTodoAdded={handleNewTodo} />}
          />
          <Route path="/todos/:id/view" element={<TodoDetails />} />
          <Route
            path="/todos/:todoId/edit"
            element={<TodoEdit todosData={todosData} updateTodo={updateTodo} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
