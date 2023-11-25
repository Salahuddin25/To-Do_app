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

// import { PageLayout } from "./components/PageLayout";
import { loginRequest } from "./authConfig";
import { callMsGraph } from "./graph";
import { ProfileData } from "./components/ProfileData";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import "./App.css";

// import Button from "react-bootstrap/Button";
import SignIn from "./components/SignIn";
import { SignOutButton } from "./components/SignOutButton";
import Header from "./components/Header";
import Authenticate from "./components/Authenticate";

initializeIcons();

function App() {
  const [todosData, setTodosData] = useState([]);
  const [users, setUsers] = useState({});
  const [newTodoAdded, setNewTodoAdded] = useState(false);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
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
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodosData(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Error parsing todos from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todosData));
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

  /**
   * Renders information about the signed-in user or a button to retrieve data about the user
   */
  const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraph(response.accessToken).then((response) =>
            setGraphData(response),
            );
            console.log(response, "data");
        });
    }

    return (
      <>
        <h5>Welcome {accounts[0].name}</h5>
        <br />
        {graphData ? (
          <ProfileData graphData={graphData} />
        ) : (
          <button onClick={RequestProfileData}>
            Request Profile Information
          </button>
        )}
      </>
    );
  };
  
  
  const Todos = () => {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<TodoCard />} />
            <Route
              index
              path="/authenticate"
              element={
                <TodoList
                  setTodosData={setTodosData}
                  users={users}
                  todosData={todosData}
                  newTodoAdded={newTodoAdded}
                />
              }
            />
            <Route
              path="/todos/add"
              element={
                <AddTodo
                  setTodosData={setTodosData}
                  todosData={todosData}
                  users={users}
                  setUsers={setUsers}
                  onNewTodoAdded={handleNewTodo}
                />
              }
            />
            <Route path="/todos/:id/view" element={<TodoDetails />} />
            <Route
              path="/todos/:todoId/edit"
              element={
                <TodoEdit todosData={todosData} updateTodo={updateTodo} />
              }
            />
            <Route path="/signin" element={<SignIn />} />
            {/* <Route path="/authenticate" element={<Authenticate />} /> */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    );
  };

  const MainContent = () => {
    return (
      <div>
        {/* <AuthenticatedTemplate>
          <Header />
          <Todos />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate> */}
        <Todos />
      </div>
    );
  };

  return (
    <MainContent />
  );
}

export default App;
