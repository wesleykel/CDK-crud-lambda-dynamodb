import { APIGatewayProxyEvent } from "aws-lambda";
import { GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { client } from "../src/handler";

export const getTodo = async (event: APIGatewayProxyEvent) => {
  console.log(event);
  try {
    const params = event.queryStringParameters;

    if (params) {
      if (params.todo) {
        const command = new GetItemCommand({
          TableName: process.env.DB,
          Key: { PK: { S: params.todo } },
        });

        const response: GetItemCommandOutput = await client.send(command);
        console.log(response);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: response.Item }),
        };
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: event }),
  };
};
