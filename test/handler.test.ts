import { handler } from "../src/handler";
import { mockApiGateWayProxyEvent, mockContext } from "../__mocks__/mocks";

test("should return hello", async () => {
  const result = await handler(mockApiGateWayProxyEvent, mockContext);

  expect(result).toHaveBeenCalled;
  expect(result).toStrictEqual({
    statusCode: 200,
    body: JSON.stringify({ message: "hello" }),
  });
});
