import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  GetItemCommand,
  DeleteItemCommand,
  PutItemCommandOutput,
  GetItemCommandOutput,
  ScanCommandOutput,
  DeleteBackupCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  console.log(event);

  if (event.httpMethod === "POST" && event.body) {
    let todo: { id: string; todo: string } = JSON.parse(event.body);
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

  if (
    event.httpMethod === "GET" &&
    event.path === "/getTodo" &&
    event.queryStringParameters
  ) {
    try {
      const params = event.queryStringParameters;

      if (params.todo) {
        const command = new UpdateItemCommand({
          TableName: process.env.DB,
          Key: { PK: { S: params.todo } },
        });

        const response: GetItemCommandOutput = await client.send(command);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: response.Item }),
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (event.httpMethod === "GET" && event.path === "/getAll") {
    try {
      const command = new ScanCommand({
        TableName: process.env.DB,
        Select: "ALL_ATTRIBUTES",
      });

      const response: ScanCommandOutput = await client.send(command);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: response.Items }),
      };
    } catch (error) {
      console.log(error);
    }
  }

  if (
    event.httpMethod === "DELETE" &&
    event.path === "/deleteTodo" &&
    event.queryStringParameters
  ) {
    const params = event.queryStringParameters;

    if (params.delete) {
      try {
        const command = new DeleteItemCommand({
          TableName: process.env.DB,
          Key: { PK: { S: params.delete } },
        });

        const response: DeleteBackupCommandOutput = await client.send(command);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: response }),
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
  if (
    event.httpMethod === "PATCH" &&
    event.path === "/updateTodo" &&
    event.body
  ) {
    let update: { id: string; amendment: string } = JSON.parse(event.body);

    if (update.id) {
      try {
        const command = new DeleteItemCommand({
          TableName: process.env.DB,
          Key: { PK: { S: params.delete } },
        });

        const response: DeleteBackupCommandOutput = await client.send(command);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: response }),
        };
      } catch (error) {
        console.log(error);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ message: event.body }) };
};
