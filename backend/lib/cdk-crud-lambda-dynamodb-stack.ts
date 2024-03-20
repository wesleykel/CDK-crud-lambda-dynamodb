//import * as cdk from "aws-cdk-lib";
import { ApiKeySourceType, Integration } from "aws-cdk-lib/aws-apigateway";
import { UsagePlan } from "aws-cdk-lib/aws-apigateway";
import { Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

import path = require("path");

const SERVICE = "crud-api-example";
export class CdkCrudLambdaDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const db = new TableV2(this, `${SERVICE}-DB`, {
      partitionKey: { name: "PK", type: AttributeType.STRING },
    });

    const lambda = new NodejsFunction(this, `${SERVICE}-todoLambda`, {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/handler.ts"),
      handler: "handler",
      description: `${SERVICE}-lambda`,
      environment: { DB: db.tableName },
      logRetention: RetentionDays.FIVE_DAYS,
      functionName: `${SERVICE}-lambda`,
    });

    const api = new RestApi(this, `${SERVICE}-rest-api `, {
      description: `${SERVICE}-rest-api `,
      restApiName: `${SERVICE}-rest-api `,
      apiKeySourceType: ApiKeySourceType.HEADER,
    });
    const apiKey = api.addApiKey(`${SERVICE}-api-key`);

    // Add Usage Plan to API Gateway
    const usagePlan = new UsagePlan(this, `${SERVICE}-usage-plan`, {
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
      description: `${SERVICE}-usage-plan`,
    });

    usagePlan.addApiKey(apiKey);
    const integration = new LambdaIntegration(lambda);

    api.root.addResource("todo").addMethod("POST", integration, {
      apiKeyRequired: true,
    });
    api.root.addResource("getTodo").addMethod("GET", integration, {
      apiKeyRequired: true,
    });
    api.root
      .addResource("getAll")
      .addMethod("GET", integration, { apiKeyRequired: true });
    api.root
      .addResource("deleteTodo")
      .addMethod("DELETE", integration, { apiKeyRequired: true });
    api.root
      .addResource("updateTodo")
      .addMethod("PATCH", integration, { apiKeyRequired: true });

    db.grantFullAccess(lambda);
  }
}
