import { APIGatewayProxyEvent } from "aws-lambda";
import {
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { client } from "../src/handler";
import { todoInput } from "../types/todoTypes";

export const updateTodo = async (event: APIGatewayProxyEvent) => {
  if (event.body) {
    let update: todoInput = JSON.parse(event.body);

    if (update.id) {
      try {
        const command = new UpdateItemCommand({
          TableName: process.env.DB,
          Key: { PK: { S: update.id } },
          UpdateExpression: "SET Todo =:newTodo",
          ExpressionAttributeValues: { ":newTodo": { S: update.todo } },
          ReturnValues: "UPDATED_NEW",
        });

        const response: UpdateItemCommandOutput = await client.send(command);
        const { $metadata } = response;

        return {
          statusCode: $metadata.httpStatusCode as number,
          body: JSON.stringify({ message: response }),
        };
      } catch (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: error }),
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: event }),
  };
};
