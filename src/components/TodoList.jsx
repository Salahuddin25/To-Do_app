import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Dropdown,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import {
  Button,
  Tooltip,
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
  ArrowDown16Filled,
  ArrowUp16Filled,
} from "@fluentui/react-icons";
import Breadcrumbs from "./Breadcrumbs";
import "./TodoList.css";

function TodoList({
  isTodoAdded,
  setIsTodoAdded,
  setTodosData,
  todosData,
}) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const loadingDuration = 1300;
  const [filter, setFilter] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const showSuccessToastMessage = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

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

  useEffect(() => {
    if (totalItems > 200) {
      showSuccessToastMessage();
    }
  }, [totalItems]);

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
        <Tooltip withArrow content={"first page"}>
          <Button
            icon={<ChevronDoubleLeft20Filled />}
            appearance="transparent"
            disabled={currentPage === 1}
            onClick={handleFirstPage}
          />
        </Tooltip>
        <Tooltip withArrow content={"previous page"}>
          <Button
            icon={<ChevronLeftFilled />}
            appearance="transparent"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </Tooltip>
        <span>{currentPage}</span>
        <Tooltip withArrow content={"next page"}>
          <Button
            icon={<ChevronRightFilled />}
            appearance="transparent"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Tooltip>
        <Tooltip withArrow content={"last page"}>
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (option) => {
    setFilter(`${option.key}`);
    setCurrentPage(1);
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let result = 0;

    if (sortColumn === "title") {
      result = a.title.localeCompare(b.title);
    } else if (sortColumn === "user") {
      const userA = users[a.userId] || "";
      const userB = users[b.userId] || "";
      result = userA.localeCompare(userB);
    } else if (sortColumn === "status") {
      result = a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    }

    return sortDirection === "asc" ? result : -result;
  });

  const renderedTodos = sortedTodos.slice(startIndex, endIndex).map((todo) => {
    const userName = users[todo?.userId] || "Unknown User";

    return (
      <TableRow key={todo.id}>
        <TableCell style={{ color: "#0070ac", textDecoration: "none" }}>
          <Link to={`/todos/${todo.id}/view`}>{todo?.title}</Link>
        </TableCell>
        <TableCell>{userName}</TableCell>
        <TableCell>{todo?.completed ? "Completed" : "Incomplete"}</TableCell>
        <TableCell>
          <Tooltip withArrow content={"View"}>
            <Link to={`/todos/${todo?.id}/view`}>
              <Button icon={<EyeRegular />} appearance="subtle" />
            </Link>
          </Tooltip>
          <Tooltip withArrow content={"Edit"}>
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
              onChange={(e, option) => handleFilterChange(option)}
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
      {showSuccessToast && (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          onDismiss={() => setShowSuccessToast(false)}
          dismissButtonAriaLabel="Close"
        >
          <Text variant="medium">Todo added successfully!</Text>
        </MessageBar>
      )}
      <div className="table-main">
        {isLoading ? (
          <Spinner label="Loading todos..." />
        ) : (
          <>
            <Table aria-label="Default table">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell
                    onClick={() => handleSort("title")}
                    style={{ cursor: "pointer" }}
                    sortable={true}
                  >
                    <b>Title</b>
                    {sortColumn === "title" && (
                      <span>
                        {sortDirection === "asc" ? (
                          <ArrowUp16Filled />
                        ) : (
                          <ArrowDown16Filled />
                        )}
                      </span>
                    )}
                  </TableHeaderCell>
                  <TableHeaderCell
                    onClick={() => handleSort("user")}
                    style={{ cursor: "pointer" }}
                    sortable={true}
                  >
                    <b>User</b>
                    {sortColumn === "user" && (
                      <span>
                        {sortDirection === "asc" ? (
                          <ArrowUp16Filled />
                        ) : (
                          <ArrowDown16Filled />
                        )}
                      </span>
                    )}
                  </TableHeaderCell>
                  <TableHeaderCell
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                    sortable={true}
                  >
                    <b>Status</b>
                    {sortColumn === "status" && (
                      <span>
                        {sortDirection === "asc" ? (
                          <ArrowUp16Filled />
                        ) : (
                          <ArrowDown16Filled />
                        )}
                      </span>
                    )}
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
    </div>
  );
}

export default TodoList;
