import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
} from "@fluentui/react-components";
import { Open16Filled } from "@fluentui/react-icons";
import React from "react";
import { Link } from "react-router-dom";
import Todo_img from "../../../../assets/todo-img.png"
import "../../../../assets/styles/todo-card.scss"

function TodoCard() {
  return (
    <div className="card-container">
      <Card>
        <CardHeader header={<b>To-Do List</b>}></CardHeader>
        <CardPreview>
          <img
            src={Todo_img}
            alt="To-do list"
          ></img>
        </CardPreview>
        <CardFooter>
          <Link to={"/todos"}>
            <Button appearance="primary" icon={<Open16Filled />}>Open</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TodoCard;
