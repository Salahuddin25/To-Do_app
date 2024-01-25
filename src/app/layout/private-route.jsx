import React, { useEffect, useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Header from "../core/components/header";
import "../../assets/styles/app.scss";
import { useMsal } from "@azure/msal-react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../core/components/sidebar";
import TodoList from "../pages/todos/components/todo-list";
import AddTodo from "../pages/todos/components/add-todo";
import TodoDetails from "../pages/todos/components/todo-details";
import TodoEdit from "../pages/todos/components/todo-edit";
import Profile from "../pages/profile/components/profile";
import ErrorPage from "../pages/common/error-page";


const PrivateRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { instance } = useMsal();
  const [todosData, setTodosData] = useState([]);
  const [newTodoAdded, setNewTodoAdded] = useState(false);

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

  const handleNewTodo = () => {
    setNewTodoAdded(true);
  };

  useEffect(() => {
    if (newTodoAdded) {
      setTimeout(() => {
        setNewTodoAdded(false);
      }, 2400);
    }
  }, [newTodoAdded]);

  const updateTodo = (updatedTodo) => {
    setTodosData((currentTodos) => 
      currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const routes = [
    {
      path: "/todos",
      element: (
        <TodoList
          setTodosData={setTodosData}
          todosData={todosData}
          newTodoAdded={newTodoAdded}
        />
      ),
    },
    {
      path: "/todos/add",
      element: (
        <AddTodo
          setTodosData={setTodosData}
          todosData={todosData}
          onNewTodoAdded={handleNewTodo}
        />
      ),
    },
    {
      path: "/todos/:id/view",
      element: <TodoDetails />,
    },
    {
      path: "/todos/:todoId/edit",
      element: <TodoEdit todosData={todosData} updateTodo={updateTodo} />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];


  const signOutUser = () => {
    localStorage.clear();
    instance.logoutRedirect({
      postLogoutRedirectUri: "/signin",
    });
  };

  const checkTokenExpiry = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setIsAuthenticated(false);
          signOutUser();
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const loggedIdToken = localStorage.getItem("signinIdToken");
    if (loggedIdToken) {
      checkTokenExpiry(loggedIdToken);
      const interval = setInterval(() => {
        checkTokenExpiry(loggedIdToken);
      }, 60000); 

      return () => clearInterval(interval);
    } else {
      setIsAuthenticated(false);
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <>
      {isAuthenticated && (
        <div className="home">
          <div>
            <Sidebar />
          </div>
          <div className="content">
            <Header />
            <div className="app">
            <Routes>
            {routes.map((route, index) => (
                  <Route
                    key={index}
                    exact
                    path={route.path}
                    element={route.element}
                  />
                ))}
            </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateRoute;