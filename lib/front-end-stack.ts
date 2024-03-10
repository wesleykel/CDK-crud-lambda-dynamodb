import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Nextjs } from "cdk-nextjs-standalone";
import { CfnOutput } from "aws-cdk-lib";
export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const nextjs = new Nextjs(this, "Nextjs", {
      nextjsPath: "./frontend/my-test-app", // relative path from your project root to NextJS
    });
    new CfnOutput(this, "CloudFrontDistributionDomain", {
      value: nextjs.distribution.distributionDomain,
    });
  }
}

//const app = new App();
//new WebStack(app, "web");
