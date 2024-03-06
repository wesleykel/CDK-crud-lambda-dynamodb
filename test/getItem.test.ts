import { CfnClientCertificate } from "aws-cdk-lib/aws-apigateway";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { delmock, mockDeleteEvent1, mockGetEvent1 } from "../__mocks__/mocks";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getTodo } from "../functions/getItem";
const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});

it("GET request should return correct values from the DynamoDB", async () => {
  {
    ddbMock.on(GetItemCommand).resolves({
      Item: { PK: { S: "1234571" }, Todo: { S: "go shopping23" } },
    });

    const todo = await getTodo(mockGetEvent1);

    expect(todo).toHaveBeenCalled;
    expect(todo).toStrictEqual({
      statusCode: 200,
      body: '{"message":{"PK":{"S":"1234571"},"Todo":{"S":"go shopping23"}}}',
    });
  }
});
const deleteResponseMock = {
  Record: { PK: { S: "1234" }, Todo: { S: "go shopping23" } },
};

it("deletes", async () => {
  //ddbMock.on(DeleteItemCommand).resolves(deleteResponseMock);

  const todo = await getTodo(delmock);

  expect(todo).toHaveBeenCalled;
  expect(todo).toStrictEqual({
    body: '{"message":{"$metadata":{"httpStatusCode":200,"requestId":"9MCQC0Q31R0QSEQP7OR0IK34UNVV4KQNSO5AEMVJF66Q9ASUAAJG","attempts":1,"totalRetryDelay":0}}}',
  });
});
