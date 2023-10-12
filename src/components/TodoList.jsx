import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Dropdown } from "@fluentui/react";
import {
  Button,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  Tooltip,
  useId,
  useToastController,
} from "@fluentui/react-components";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Spinner,
} from "@fluentui/react-components";
import {
  EyeRegular,
  EditRegular,
  Add16Filled,
  ChevronLeftFilled,
  ChevronRightFilled,
  ChevronDoubleLeft20Filled,
  ChevronDoubleRight20Filled,
} from "@fluentui/react-icons";
import "./TodoList.css";
import Breadcrumbs from "./Breadcrumbs";

function TodoList({isTodoAdded, setIsTodoAdded, setTodosData, todosData}) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const loadingDuration = 1300;
  const [filter, setFilter] = useState(null);
  // const toasterId = useId("toaster");
  // const { dispatchToast } = useToastController(toasterId);

  // const showSuccessToast = () => {
  //   dispatchToast(
  //     <Toast position="top-end">
  //       <ToastTitle action={<Link>Undo</Link>}>Todo Added</ToastTitle>
  //       <ToastBody>Your todo has been successfully added!</ToastBody>
  //     </Toast>,
  //     { intent: "success" }
  //   );
  // };

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        setTodos(response?.data);
        setTodosData(response?.data);
        setTimeout(() => {
          setIsLoading(false);
        }, loadingDuration);
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setIsLoading(false);
        }, loadingDuration);
      });

    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const usersData = {};
        response?.data?.forEach((user) => {
          usersData[user?.id] = user?.name;
        });
        setUsers(usersData);
        setTimeout(() => {
          setIsLoading(false);
        }, loadingDuration);
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setIsLoading(false);
        }, loadingDuration);
      });
      // if (isTodoAdded) {
      //   showSuccessToast();
      //   setIsTodoAdded(false);
      // }
  }, [setTodosData, isTodoAdded, setIsTodoAdded]);

  const filteredTodos = todosData.filter((todo) => {
    if (!filter || filter === "all") {
      return true;
    } else if (filter === "completed") {
      return todo.completed;
    } else if (filter === "incomplete") {
      return !todo.completed;
    }
  });

  const totalItems = filteredTodos?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    const maxPage = Math.ceil(filteredTodos.length / itemsPerPage);
    setCurrentPage(Math.min(Math.max(newPage, 1), maxPage));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const renderPagination = () => {
    return (
      <div className="pagination">
        <span>
          {startIndex + 1} to {endIndex} of {totalItems}
        </span>
        <Tooltip content={"first page"}>
          <Button
            icon={<ChevronDoubleLeft20Filled />}
            appearance="transparent"
            disabled={currentPage === 1}
            onClick={handleFirstPage}
          />
        </Tooltip>
        <Tooltip content={"previous page"}>
          <Button
            icon={<ChevronLeftFilled />}
            appearance="transparent"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </Tooltip>
        <Tooltip content={"next page"}>
          <Button
            icon={<ChevronRightFilled />}
            appearance="transparent"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Tooltip>
        <Tooltip content={"last page"}>
          <Button
            icon={<ChevronDoubleRight20Filled />}
            appearance="transparent"
            disabled={currentPage === totalPages}
            onClick={handleLastPage}
          />
        </Tooltip>
      </div>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const renderedTodos = filteredTodos
    .slice(startIndex, endIndex)
    .map((todo) => {
      const userName = users[todo?.userId] || "Unknown User";

      return (
        <TableRow key={todo.id}>
          <TableCell style={{ color: "#0070ac", textDecoration: "none" }}>
            <Link to={`/todos/${todo.id}/view`}>{todo?.title}</Link>
          </TableCell>
          <TableCell>{userName}</TableCell>
          <TableCell>{todo?.completed ? "Completed" : "Incomplete"}</TableCell>
          <TableCell>
            <Tooltip content={"View"}>
              <Link to={`/todos/${todo?.id}/view`}>
                <Button icon={<EyeRegular />} appearance="subtle" />
              </Link>
            </Tooltip>
            <Tooltip content={"Edit"}>
              <Link to={`/todos/${todo?.id}/edit`}>
                <Button icon={<EditRegular />} appearance="subtle" />
              </Link>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <div className="table">
      <div className="header-container">
        <div className="table-bread">
          <Breadcrumbs />
        </div>
        <div className="btn">
          <div className="dropdown-filter">
            <Dropdown
              placeholder="Status"
              selectedKey={filter}
              onChange={(e, option) => setFilter(`${option.key}`)}
              options={[
                { key: "all", text: "All" },
                { key: "completed", text: "Completed" },
                { key: "incomplete", text: "Incomplete" },
              ]}
            />
          </div>
          <div>
            <Link to="/todos/add">
              <Button icon={<Add16Filled />} appearance="primary">
                Add Todo
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="table-main">
        {isLoading ? (
          <Spinner label="Loading todos..." />
        ) : (
          <>
            <Table aria-label="Default table">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>
                    <b>Title</b>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <b>User</b>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <b>Status</b>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <b>Actions</b>
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>{renderedTodos}</TableBody>
            </Table>
            {renderPagination()}
          </>
        )}
      </div>
      {/* <Toaster toasterId={toasterId} /> */}
    </div>
  );
}

export default TodoList;
