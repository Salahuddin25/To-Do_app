import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import TodoDetails from "./components/TodoDetails";
import TodoEdit from "./components/TodoEdit";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import ErrorPage from "./components/ErrorPage";

initializeIcons();

function App() {

  const [todosData, setTodosData] = useState([]);
  // const [isTodoAdded, setIsTodoAdded] = useState(false);

  return (
    <Router>
      <div className="app">
        <Routes>
        <Route index path="/todos" element={<TodoList setTodosData={setTodosData} todosData={todosData} /*isTodoAdded={isTodoAdded} setIsTodoAdded={setIsTodoAdded}*/ />} />
          <Route path="/todos/add" element={<AddTodo setTodosData={setTodosData} /* setIsTodoAdded={setIsTodoAdded} *//>} />
          <Route path="/todos/:id/view" element={<TodoDetails />} />
          <Route path="/todos/:todoId/edit" element={<TodoEdit setTodosData={setTodosData} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
