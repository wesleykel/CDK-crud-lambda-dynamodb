import { mockClient } from "aws-sdk-client-mock";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { getTodo } from "../functions/getItem";
const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});
