import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import path = require("path");
export class CdkCrudLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const SERVICE = "Crud Lambda";

    const db = new cdk.aws_dynamodb.TableV2(this, "todoDB", {
      partitionKey: { name: "PK", type: cdk.aws_dynamodb.AttributeType.STRING },
    });

    const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoLambda",
      {
        runtime: Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "../src/handler.ts"),
        handler: "handler",
        description: `${SERVICE}-Lambda`,
        environment: { DB: db.tableName },
      }
    );
    const api = new cdk.aws_apigateway.LambdaRestApi(this, "todoApi", {
      handler: lambda,
      proxy: false,
      description: `${SERVICE}-Lambda rest api `,
      restApiName: "rest api",
    });

    const addTodo = api.root.addResource("todo");
    addTodo.addMethod("POST");
    const getSingleTodo = api.root.addResource("getTodo");
    getSingleTodo.addMethod("GET");
    const getAllTodo = api.root.addResource("getAll");
    getAllTodo.addMethod("GET");
    const deleteTodo = api.root.addResource("deleteTodo");
    deleteTodo.addMethod("DELETE");
    const updateTodo = api.root.addResource("updateTodo");
    updateTodo.addMethod("PATCH");
    db.grantFullAccess(lambda);
  }
}
