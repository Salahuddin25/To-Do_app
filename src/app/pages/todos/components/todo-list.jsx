import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, MessageBar, MessageBarType, Text } from "@fluentui/react";
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
import Breadcrumbs from "../../common/breadcrumbs";
import "../../../../assets/styles/todo-list.scss";
import { useGetTodosQuery } from "./todoapi";
import usersData from "./users-data";

function TodoList({ newTodoAdded }) {
  const [users, setUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filter, setFilter] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [showSuccessBar, setShowSuccessBar] = useState(false);
  const {data: todos, isFetching} = useGetTodosQuery();
  

  const showSuccessBarMessage = () => {
    setShowSuccessBar(true);
    setTimeout(() => {
      setShowSuccessBar(false);
    }, 2400);
  };

  useEffect(() => {
    const userData = usersData.users.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
    setUsers(userData);
  }, []);

  const filteredTodos = todos?.records?.filter((todo) => {
    if (!filter || filter === "all") {
      return true;
    } else if (filter === "completed") {
      return todo.status === "Completed";
    } else if (filter === "incomplete") {
      return todo.status === "Incomplete" ;
    }
    return true;
  });

  const totalItems = filteredTodos?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (newTodoAdded) {
      showSuccessBarMessage();
    }
  }, [newTodoAdded]);

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

  const sortedTodos = filteredTodos
    ? [...filteredTodos].sort((a, b) => {
        let result = 0;

        if (sortColumn === "title") {
          result = a.title.localeCompare(b.title);
        } else if (sortColumn === "user") {
          const userA = users[a.selectedUser] || "";
          const userB = users[b.selectedUser] || "";
          result = userA.localeCompare(userB);
        } else if (sortColumn === "status") {
          result = a.status === "Completed" === b.status === "Completed" ? 0 : a.status === "Completed" ? -1 : 1;
        }

        return sortDirection === "asc" ? result : -result;
      })
    : [];

    const renderedTodos = sortedTodos
    ? sortedTodos.slice(startIndex, endIndex).map((todo) => {
        const userName = users[todo?.selectedUser] || "Unknown User";

    return (
      <TableRow key={todo.id}>
        <TableCell>
          <div className="table-cell-title">
            <Link to={`/todos/${todo.id}/view`}>{todo?.title}</Link>
          </div>
        </TableCell>
        <TableCell>{userName}</TableCell>
        <TableCell>{todo?.status}</TableCell>
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
  })
  : null;

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
      {showSuccessBar && (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          onDismiss={() => setShowSuccessBar(false)}
          dismissButtonAriaLabel="Close"
        >
          <Text variant="medium">Todo added successfully!</Text>
        </MessageBar>
      )}
      <div className="table-main">
        {isFetching ? (
          <Spinner label="Loading todos..." />
        ) : (
          <>
          {filteredTodos ? (
            <Table aria-label="Default table">
              <TableHeader>
                <TableRow>
                  <TableHeaderCell
                    onClick={() => handleSort("title")}
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
          ) : (
            <div>no todos to display</div>
            )}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default TodoList;
