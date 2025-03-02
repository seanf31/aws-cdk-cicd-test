import * as cdk from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { MyPipelineAppStage } from './my-cdk-stage';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkCicdTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('seanf31/aws-cdk-cicd-test', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    const testingStage = pipeline.addStage(
      new MyPipelineAppStage(this, 'test', {
        env: { account: '585008082334', region: 'us-east-1' },
      })
    );
    testingStage.addPost(new ManualApprovalStep('my-manual-approval-step'));

    pipeline.addStage(
      new MyPipelineAppStage(this, 'test2', {
        env: { account: '585008082334', region: 'us-west-2' },
      })
    );
  }
}
