import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

export function createKinesisAnalyticsRole(name: string): aws.iam.Role {
    return  new aws.iam.Role(name, {
        name: `KinesisAnalyticsApp-${name}`,
        assumeRolePolicy: JSON.stringify(
            {
                "Version": "2012-10-17",
                "Statement": [
                  {
                    "Effect": "Allow",
                    "Principal": {
                      "Service": "kinesisanalytics.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                  }
                ]
            }
        )
    });
}

export function attackPolicyToReadStreams(role: aws.iam.Role) {
    // policy to read all streams
    const policy = new aws.iam.Policy("kinesis-read-streams-policy", {
        description: "A policy that allows reading kinesis streams",
        policy: `{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "kinesis:Get*",
                        "kinesis:List*",
                        "kinesis:Describe*"
                    ],
                    "Resource": "*"
                }
            ]
        }
    `,
    });

    const attachPolicy = new aws.iam.RolePolicyAttachment("kinesis-analytics-streams-attach", {
        role: role.name,
        policyArn: policy.arn,
    });
}