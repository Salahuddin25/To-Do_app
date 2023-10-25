import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { initializeIcons } from "@fluentui/react/lib/Icons";
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

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            index
            path="/"
            element={<TodoCard />}
          />
          <Route
            path="/todos"
            element={<TodoList setTodosData={setTodosData} todosData={todosData} />}
          />
          <Route
            path="/todos/add"
            element={<AddTodo setTodosData={setTodosData} />}
          />
          <Route
            path="/todos/:id/view"
            element={<TodoDetails />}
          />
          <Route
            path="/todos/:todoId/edit"
            element={<TodoEdit setTodosData={setTodosData} />}
          />
          <Route
            path="*"
            element={<ErrorPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
