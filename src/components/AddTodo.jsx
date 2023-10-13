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

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  selectedUser: Yup.string().required("Please select a user"),
});

function AddTodo(props) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch user data from an API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const userOptions = response.data.map((user) => ({
          key: user?.id?.toString(),
          text: user.name,
        }));
        setUsers(userOptions);
      })
      .catch((error) => console.error(error));
  }, []);

  // Initialize Formik for form handling
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

      // Send a POST request to add a new todo
      axios
        .post("https://jsonplaceholder.typicode.com/todos", newTodo)
        .then((response) => {
          console.log("Todo added:", response.data);
          props.setTodosData((data) => {
            return [...data, newTodo];
          });
          navigate("/todos");
          props.setIsTodoAdded(true);
          formik.resetForm();
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
              options={users}
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
