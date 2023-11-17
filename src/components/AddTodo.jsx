import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dropdown } from "@fluentui/react";
import { Radio, Button, Field, Input } from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import "../App.css";
import "./AddTodo.css";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  selectedUser: Yup.string().required("Please select a user"),
});

function AddTodo(props) {
  const navigate = useNavigate();

  const userOptions = Object.entries(props.users).map(([key, value]) => ({
    key: key.toString(),
    text: value,
  }));

  const formik = useFormik({
    initialValues: {
      title: "",
      selectedUser: "",
      status: "Incomplete",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newTodo = {
        title: values.title,
        userId: parseInt(values.selectedUser),
        completed: values.status === "Completed",
      };
      navigate("/todos");

      axios.post("https://jsonplaceholder.typicode.com/todos", newTodo)
        .then((response) => {
          console.log("Todo added:", response.data);
          const addedTodo = {
            ...response.data,
            id: props.todosData.length + 1
          };
          props.setTodosData(prevTodos => [...prevTodos, addedTodo]);
          if (!props.users[response.data.userId]) {
            axios.get(`https://jsonplaceholder.typicode.com/users/${response.data.userId}`)
              .then(userResponse => {
                props.setUsers(prevUsers => ({
                  ...prevUsers,
                  [userResponse.data.id]: userResponse.data.name
                }));
              })
              .catch(error => console.error(error));
          }
          navigate("/todos");
          formik.resetForm();
          props.onNewTodoAdded();
        })
        .catch((error) => console.error(error));
    },
  });

  return (
    <div className="todo-form">
      <div className="form-bread">
        <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      <form onSubmit={formik.handleSubmit} className="todo-form-body">
        <div>
          <Field
            label="Title"
            validationMessage={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : undefined
            }
          >
            <Input
              name="title"
              type="text"
              value={formik.values.title}
              placeholder="Enter todo title here"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: "fit-content" }}
            />
          </Field>
        </div>
        <div>
          <label>Status</label>
          <div>
            <Radio
              value="Completed"
              label="Completed"
              checked={formik.values.status === "Completed"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
            />
            <Radio
              value="Incomplete"
              label="Incomplete"
              checked={formik.values.status === "Incomplete"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div>
          <label>User</label>
          <div>
            <Dropdown
              placeholder="Select a user"
              selectedKey={formik.values.selectedUser}
              required
              options={userOptions}
              onChange={(_, option) =>
                formik.setFieldValue("selectedUser", option.key.toString())
              }
              onBlur={formik.handleBlur}
              style={{ width: "185px" }}
              errorMessage={
                formik.touched.selectedUser && formik.errors.selectedUser
                  ? formik.errors.selectedUser
                  : undefined
              }
            />
          </div>
        </div>
        <div className="form-btn">
          <Button
            type="submit"
            appearance="primary"
            disabled={formik.isSubmitting}
          >
            Save
          </Button>
          <Link to="/todos">
            <Button>Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddTodo;
