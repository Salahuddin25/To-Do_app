import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dropdown } from "@fluentui/react";
import { Radio, Button, Field, Input, Toaster, useToastController, Toast, useId, ToastTitle, ToastBody, ToastFooter } from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../common/breadcrumbs";
import "../../../../assets/styles/app.scss";
import "../../../../assets/styles/add-todo.scss";
import { useAddTodoMutation, } from "./todoapi";
import usersData from "./users-data";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  selectedUser: Yup.string().required("Please select a user"),
});

function AddTodo(props) {
  const navigate = useNavigate();

  const userOptions = usersData.users.map((user) => ({
    key: user.id.toString(),
    text: user.name,
  }));

  const [addTodo, { isLoading, isError }] = useAddTodoMutation();

  const toasterId = useId("success-toaster");
  const { dispatchToast } = useToastController(toasterId);

  const formik = useFormik({
    initialValues: {
      title: "",
      selectedUser: "",
      status: "Incomplete",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const newTodo = {
        title: values.title,
        selectedUser: values.selectedUser,
        status: values.status,
      };
    
      console.log("Payload:", newTodo);
    
      try {
        console.log("Request payload:", newTodo);
        const response = await addTodo(newTodo);
        console.log("Response from backend:", response);
      
        const addedTodo = {
          id: response.id,
          title: values.title,
          selectedUser: values.selectedUser,
          status: values.status,
        };
      
        console.log("Todo added:", addedTodo);
        props.onNewTodoAdded(addedTodo, usersData.users);
        dispatchToast(
          <Toast>
            <ToastTitle>To-do Added</ToastTitle>
            <ToastBody>The to-do data is added successfully to the table.</ToastBody>
          </Toast>,
          { intent: "success" }
        );
    
        // navigate("/todos");
        formik.resetForm();
      } catch (error) {
        console.error("Error from backend:", error);
      }
    },
  });

  return (
    <div className="todo-form">
    <Toaster toasterId={toasterId} />
      <div className="form-bread">
        <Breadcrumbs />
      </div>
      <hr className="horizontal-line"></hr>
      <form onSubmit={formik.handleSubmit} className="todo-form-body">
        <div>
          <Field
            label="Title"
            validationMessage={formik.touched.title && formik.errors.title
              ? formik.errors.title
              : undefined}
          >
          <div className="input-field">
            <Input
              name="title"
              type="text"
              value={formik.values.title}
              placeholder="Enter todo title here"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              />
              </div>
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
              disabled />
            <Radio
              value="Incomplete"
              label="Incomplete"
              checked={formik.values.status === "Incomplete"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
          </div>
        </div>
        <div>
          <label>User</label>
          <div className="add-dropdown">
            <Dropdown
              placeholder="Select a user"
              selectedKey={formik.values.selectedUser}
              required
              options={userOptions}
              onChange={(_, option) => formik.setFieldValue("selectedUser", option.key.toString())}
              onBlur={formik.handleBlur}
              errorMessage={formik.touched.selectedUser && formik.errors.selectedUser
                ? formik.errors.selectedUser
                : undefined} />
          </div>
        </div>
        <div className="form-btn">
          <Button
            type="submit"
            appearance="primary"
            disabled={formik.isSubmitting}
          >
            Add
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
