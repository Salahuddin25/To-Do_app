import React from "react";
import { Breadcrumb } from "@fluentui/react";
import { useNavigate, useLocation } from "react-router-dom";

function Breadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = () => {
    navigate(`/todos`);
  };

  const getCurrentBreadcrumbItems = () => {
    const path = location.pathname;

    if (path === "/todos") {
      return [
        {
          text: "To-Dos",
          key: "todos",
          isCurrentItem: true,
        },
      ];
    } else if (path === "/todos/add") {
      return [
        { text: "To-Dos", key: "todos", onClick: navigateBack },
        {
          text: "New",
          key: "new",
          isCurrentItem: true,
        },
      ];
    } else if (path.includes("/todos/") && path.includes("/view")) {
      return [
        { text: "To-Dos", key: "todos", onClick: navigateBack },
        {
          text: "View",
          key: "viewTodo",
          isCurrentItem: true,
        },
      ];
    } else if (path.includes("/todos/") && path.includes("/edit")) {
      return [
        { text: "To-Dos", key: "todos", onClick: navigateBack },
        {
          text: "Edit",
          key: "editTodo",
          isCurrentItem: true,
        },
      ];
    } else if (path.includes("/profile")) {
      return [
        {
          text: "Profile",
          key: "profile",
          isCurrentItem: true,
        },
      ];
    }

    return [];
  };

  const breadcrumbItems = getCurrentBreadcrumbItems();

  return <Breadcrumb items={breadcrumbItems} />;
}

export default Breadcrumbs;
