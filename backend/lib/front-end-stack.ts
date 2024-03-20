import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Nextjs } from "cdk-nextjs-standalone";
import { CfnOutput } from "aws-cdk-lib";
import { aws_ssm } from "aws-cdk-lib";
import { IStringParameter } from "aws-cdk-lib/aws-ssm";

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const apiKey = aws_ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      "ApiKey",
      { parameterName: "apikey" }
    );

    const nextjs = new Nextjs(this, "Nextjs", {
      nextjsPath: "../frontend/my-test-app",
      environment: { API_KEY: apiKey.stringValue },
    });

    new CfnOutput(this, "CloudFrontDistributionDomain", {
      value: nextjs.distribution.distributionDomain,
    });
  }
}

//const app = new App();
//new WebStack(app, "web");
