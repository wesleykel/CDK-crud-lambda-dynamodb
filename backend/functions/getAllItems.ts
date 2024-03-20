import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { client } from "../src/handler";

export const getAllTodos = async () => {
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
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error }),
    };
  }
};
