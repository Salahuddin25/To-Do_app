import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./TodoDetails.css";
import { Button, Label, Spinner } from "@fluentui/react-components";
import Breadcrumbs from "./Breadcrumbs";

function TodoDetails() {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then((response) => {
        setTodo(response.data);
        axios
          .get(`https://jsonplaceholder.typicode.com/users/${response.data.userId}`)
          .then((userResponse) => {
            setUser(userResponse.data);
            setIsLoading(false);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <div className="todo-details">
    <div className="detail-bread">
      <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      {isLoading ? (
        <Spinner label="Loading..." />
      ) : (
        <div className="todo-details-body">
          <div>
            <Label>Title</Label>
            <p>{todo.title}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p>{todo.completed ? "Completed" : "Incomplete"}</p>
          </div>
          <div>
            <Label>User Details</Label>
            <div className="user">
              <div>
                <Label>Name</Label>
                <p> {user.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p> {user.email}</p>
              </div>
            </div>
          </div>
          <div className="view-btn">
          <Link to="/todos">
            <Button>Cancel</Button>
          </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoDetails;
