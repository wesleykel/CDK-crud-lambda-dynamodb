import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getTodo } from "../functions/getItem";
import { addTodo } from "../functions/putItem";
import { getAllTodos } from "../functions/getAllItems";
import { deleteTodo } from "../functions/deleteItem";
import { updateTodo } from "../functions/updateItem";
export const client = new DynamoDBClient({ region: "us-east-1" });
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === "POST") {
    console.log(event);

    let i = await addTodo(event);
    console.log(i);
    return i;
  }

  if (
    event.httpMethod === "GET" &&
    event.path === "/getTodo"
    // event.queryStringParameters
  ) {
    console.log(event);
    let i = await getTodo(event);
    console.log(i);
    return i;
  }

  if (event.httpMethod === "GET" && event.path === "/getAll") {
    return await getAllTodos();
  }

  if (
    event.httpMethod === "DELETE" &&
    event.path === "/deleteTodo" &&
    event.queryStringParameters
  ) {
    return await deleteTodo(event);
  }
  if (
    event.httpMethod === "PATCH" &&
    event.path === "/updateTodo" &&
    event.body
  ) {
    return await updateTodo(event);
  }

  return { statusCode: 401, body: JSON.stringify({ message: event.body }) };
};
