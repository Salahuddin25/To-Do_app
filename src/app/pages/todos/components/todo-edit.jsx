// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   Button,
//   Dropdown,
//   Field,
//   Input,
//   Option,
//   Radio,
//   Spinner,
// } from "@fluentui/react-components";
// import Breadcrumbs from "../../common/breadcrumbs";
// import "../../../../assets/styles/todo-edit.scss";
// import { useGetTodosQuery } from "./todoapi";
// import usersData from "./users-data";

// function TodoEdit({ updateTodo }) {
//   const { todoId } = useParams();
//   const navigate = useNavigate();
//   const [todo, setTodo] = useState({
//     title: "",
//     completed: false,
//     userId: null,
//   });
//   const { data: todos, isFetching } = useGetTodosQuery();
//   const [user, setUser] = useState(null);
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isTitleValid, setIsTitleValid] = useState(true);

//   useEffect(() => {
//     const todoToEdit = todos?.records?.find((t) => t.id === parseInt(todoId));
//     if (todoToEdit) {
//       setTodo(todoToEdit);
//       setStatus(todoToEdit.completed ? "completed" : "incomplete");
//       setLoading(false);
//     } else {
//       setError("No Data Found!");
//       setLoading(false);
//     }
//   }, [todoId, todos]);

// useEffect(() => {
//   const fetchUser = async (userId) => {
//     try {
//       const response = await axios.get(
//         `https://jsonplaceholder.typicode.com/users/${userId}`
//       );
//       setUser(response.data);
//     } catch (userError) {
//       setError("No Data Found!");
//       setLoading(false);
//     }
//   };

//   if (todo.userId) {
//     fetchUser(todo.userId);
//   }
// }, [todo.userId]);

//   useEffect(() => {
//     const userToEdit = usersData.users.find((user) => user.id === todo.userId);
//     setUser(userToEdit);
//   }, [todo.userId]);

//   useEffect(() => {
//     setStatus(todo.completed ? "completed" : "incomplete");
//   }, [todo.completed]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "title") {
//       setIsTitleValid(value.trim().length > 0);
//     }

//     if (name === "status") {
//       setStatus(value);
//       setTodo({
//         ...todo,
//         completed: value === "completed",
//       });
//     } else {
//       setTodo({
//         ...todo,
//         [name]: value,
//       });
//     }
//   };

//   const handleInputBlur = (e) => {
//     const { name, value } = e.target;

//     if (name === "title") {
//       setIsTitleValid(value.trim().length > 0);
//     }
//   };

//   const handleSave = () => {
//     updateTodo({
//       ...todo,
//       completed: status === "completed",
//     });
//     navigate("/todos");
//   };

//   return (
//     <div className="todo-edit">
//       <div className="edit-bread">
//         <Breadcrumbs />
//       </div>
//       <hr className="horizontal-line"></hr>
//       {loading ? (
//         <Spinner label="Loading..." />
//       ) : error ? (
//         <div className="error-message-edit">
//           <img
//             src="https://static.thenounproject.com/png/4440902-200.png"
//             alt="No Data Found Icon"
//             className="error-image-edit"
//           />
//           {error}
//         </div>
//       ) : (
//         <div className="todo-edit-body">
//           <div>
//             <Field
//               label="Title"
//               required
//               validationMessage={!isTitleValid && "Title is required."}
//             >
//               <div className="input-field">
//                 <Input
//                   type="text"
//                   name="title"
//                   value={todo.title}
//                   onChange={handleInputChange}
//                   onBlur={handleInputBlur}
//                 />
//               </div>
//             </Field>
//           </div>
//           <div>
//             <label>Status</label>
//             <div>
//               <Radio
//                 id="completed"
//                 name="status"
//                 value="completed"
//                 checked={status === "completed"}
//                 onChange={handleInputChange}
//               />
//               <label htmlFor="completed">Completed</label>
//             </div>
//             <div>
//               <Radio
//                 id="incomplete"
//                 name="status"
//                 value="incomplete"
//                 checked={status === "incomplete"}
//                 onChange={handleInputChange}
//               />
//               <label htmlFor="incomplete">Incomplete</label>
//             </div>
//           </div>
//           <div>
//             <label>User</label>
//             <div className="dropdown">
//               <Dropdown name="user" value={user ? user.name : ""} disabled>
//                 {user && (
//                   <Option key={user.id} value={user.name}>
//                     {user.name}
//                   </Option>
//                 )}
//               </Dropdown>
//             </div>
//           </div>
//           <div className="edit-btn">
//             <Button
//               onClick={handleSave}
//               appearance="primary"
//               disabled={!isTitleValid}
//             >
//               Save
//             </Button>
//             <Link to="/todos">
//               <Button>Cancel</Button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TodoEdit;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  Field,
  Input,
  Option,
  Radio,
  Spinner,
} from "@fluentui/react-components";
import Breadcrumbs from "../../common/breadcrumbs";
import "../../../../assets/styles/todo-edit.scss";
import usersData from "./users-data";
import { useGetTodoByIdQuery, useEditTodoMutation } from "./todoapi";

function TodoEdit({ updateTodo }) {
  const { todoId } = useParams();
  const navigate = useNavigate();

  const {
    data: todo,
    error: todoError,
    isLoading: isTodoLoading,
  } = useGetTodoByIdQuery(todoId);
  const [editTodo, { isLoading: isEditingTodo }] = useEditTodoMutation();

  console.log("Todo Data:", todo);

  const [editedTodo, setEditedTodo] = useState({});
  const [isTitleValid, setIsTitleValid] = useState(true);

  useEffect(() => {
    if (todo) {
      setEditedTodo({
        title: todo.result?.title,
        status: todo.result?.status,
        selectedUser: todo.result?.selectedUser,
      });
    }
  }, [todo]);

  const handleInputChange = (fieldName, value) => {
    setEditedTodo((prevTodo) => ({
      ...prevTodo,
      [fieldName]: value,
    }));

    setIsTitleValid(value.trim() !== "");
  };

  const handleSave = async () => {
    if (!isTitleValid) {
      console.error("Title is required.");
      return;
    }

    try {
      await editTodo({ id: todoId, ...editedTodo });
      navigate("/todos");
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const getUserDetails = (userId) => {
    const userDetails = usersData.users.find(
      (user) => user.id === Number(userId)
    );
    console.log("User Details for ID:", userId, userDetails);
    return userDetails;
  };

  const userDetails = todo ? getUserDetails(todo.result?.selectedUser) : null;

  const todoToEdit = todo?.result;

  return (
    <div className="todo-edit">
      <div className="edit-bread">
        <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      {isTodoLoading ? (
        <Spinner label="Loading..." />
      ) : todoError ? (
        <div className="error-message-edit">
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="No Data Found Icon"
            className="error-image-edit"
          />
          <div>No Data Found!</div>
        </div>
      ) : (
        <div className="todo-edit-body">
          <div>
            <Field
              label="Title"
              required
              validationMessage={!isTitleValid && "Title is required."}
            >
              <div className="input-field">
                <Input
                  type="text"
                  name="title"
                  value={editedTodo.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
            </Field>
          </div>
          <div>
            <label>Status</label>
            <div>
              <Radio
                id="completed"
                name="status"
                value="completed"
                checked={editedTodo.status === "Completed"}
                onChange={() => handleInputChange("status", "Completed")}
              />
              <label htmlFor="completed">Completed</label>
            </div>
            <div>
              <Radio
                id="incomplete"
                name="status"
                value="incomplete"
                checked={editedTodo.status === "Incomplete"}
                onChange={() => handleInputChange("status", "Incomplete")}
              />
              <label htmlFor="incomplete">Incomplete</label>
            </div>
          </div>
          {userDetails && (
            <div>
              <label>User</label>
              <div className="dropdown">
                <Dropdown name="user" value={userDetails.name} disabled>
                  <Option key={userDetails.id} value={userDetails.name}>
                    {userDetails.name}
                  </Option>
                </Dropdown>
              </div>
            </div>
          )}
          <div className="edit-btn">
            <Button
              onClick={handleSave}
              appearance="primary"
              disabled={!isTitleValid || isEditingTodo}
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
