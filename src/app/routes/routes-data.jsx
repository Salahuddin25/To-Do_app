// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TodoList from "../core/components/todo-list";
// import AddTodo from "../core/components/add-todo";
// import TodoDetails from "../core/components/todo-details";
// import TodoEdit from "../core/components/todo-edit";
// import Profile from "../core/components/profile";
// import ErrorPage from "../core/components/error-page";

// const TodosManager = () => {
//   const [todosData, setTodosData] = useState([]);
//   const [users, setUsers] = useState({});
//   const [newTodoAdded, setNewTodoAdded] = useState(false);

//   useEffect(() => {
//     axios
//       .get("https://jsonplaceholder.typicode.com/users")
//       .then((response) => {
//         const usersData = response.data.reduce((acc, user) => {
//           acc[user.id] = user.name;
//           return acc;
//         }, {});
//         setUsers(usersData);
//       })
//       .catch((error) => console.error("Error fetching users", error));
//   }, []);

//   useEffect(() => {
//     try {
//       const savedTodos = localStorage.getItem("todos");
//       if (savedTodos) {
//         setTodosData(JSON.parse(savedTodos));
//       }
//     } catch (error) {
//       console.error("Error parsing todos from localStorage", error);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(todosData));
//   }, [todosData]);

//   const handleNewTodo = () => {
//     setNewTodoAdded(true);
//   };

//   useEffect(() => {
//     if (newTodoAdded) {
//       setTimeout(() => {
//         setNewTodoAdded(false);
//       }, 2400);
//     }
//   }, [newTodoAdded]);

//   const updateTodo = (updatedTodo) => {
//     setTodosData((currentTodos) => 
//       currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
//     );
//   };

//   const routeConfig = [
//     {
//       path: "/todos",
//       component: TodoList,
//       props: { setTodosData, users, todosData, newTodoAdded }
//     },
//     {
//       path: "/todos/add",
//       component: AddTodo,
//       props: { setTodosData, todosData, users, setUsers, onNewTodoAdded: handleNewTodo }
//     },
//     {
//       path: "/todos/:id/view",
//       component: TodoDetails,
//       props: {} // Add any props needed for TodoDetails
//     },
//     {
//       path: "/todos/:todoId/edit",
//       component: TodoEdit,
//       props: { todosData, updateTodo }
//     },
//     {
//       path: "/profile",
//       component: Profile,
//       props: {} // Add any props needed for Profile
//     },
//     {
//       path: "*",
//       component: ErrorPage,
//       props: {} // Add any props needed for ErrorPage
//     }
//   ];

//   // Additional logic or return statement here if needed
// };

// export default TodosManager;









