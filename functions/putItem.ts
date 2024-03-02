import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { client } from "../src/handler";
import { todoInput } from "../types/todoTypes";
export const addTodo = async (event: APIGatewayProxyEvent) => {
  if (event.body) {
    let todo: todoInput = JSON.parse(event.body);
    console.log(todo);
    try {
      const command = new PutItemCommand({
        TableName: process.env.DB,
        Item: { PK: { S: todo.id }, Todo: { S: todo.todo } },
      });
      const response: PutItemCommandOutput = await client.send(command);
      console.log(response);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: response }),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: event }),
  };
};
