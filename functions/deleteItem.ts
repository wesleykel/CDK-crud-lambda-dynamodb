import { APIGatewayProxyEvent } from "aws-lambda";
import {
  DeleteItemCommand,
  DeleteBackupCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { client } from "../src/handler";

export const deleteTodo = async (event: APIGatewayProxyEvent) => {
  if (event.queryStringParameters) {
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
