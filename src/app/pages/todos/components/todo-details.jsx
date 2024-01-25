import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Label, Spinner } from "@fluentui/react-components";
import Breadcrumbs from "../../common/breadcrumbs";
import "../../../../assets/styles/todo-details.scss";
import { useGetTodoByIdQuery } from './todoapi';
import usersData from "./users-data";

function TodoDetails() {
  const { id } = useParams();

  const { data: todo, error: todoError, isLoading: isTodoLoading } = useGetTodoByIdQuery(id);

  console.log('Todo Data:', todo);

  const getUserDetails = (userId) => {
    console.log('Selected User ID:', userId, typeof userId);
    const userDetails = usersData.users.find(user => user.id === Number(userId));
    console.log('User Details for ID:', userId, userDetails);
    return userDetails;
  }

  const userDetails = todo ? getUserDetails(todo.result?.selectedUser) : null;
  
  return (
    <div className="todo-details">
      <div className="detail-bread">
        <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      {isTodoLoading  ? (
        <Spinner label="Loading..." />
      ) : todoError ? (
        <div className="error-message-view">
          <img
            src="https://static.thenounproject.com/png/4440902-200.png"
            alt="No Data Found Icon"
            className="error-image-view"
          />
         <div>No Data Found!</div>
        </div>
      ) : (
        <div className="todo-details-body">
          <div>
            <Label>Title</Label>
            <p>{todo?.result?.title}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p>{todo?.result?.status}</p>
          </div>
          {userDetails ? (
            <div>
              <Label>User Details</Label>
              <div className="user">
                <div>
                  <Label>Name</Label>
                  <p>{userDetails.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{userDetails.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>No user details available.</div>
          )}
          <div className="view-btn">
            <Link to="/todos">
              <Button>Back</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoDetails;
