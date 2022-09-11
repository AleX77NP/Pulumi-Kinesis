import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

export function createKinesisStream(name: string): aws.kinesis.Stream {
    return new aws.kinesis.Stream(name.replace("_", "-"), {
        name: name,
        retentionPeriod: 48,
        shardCount: 1,
        shardLevelMetrics: [
            "IncomingBytes",
            "OutgoingBytes",
        ],
        streamModeDetails: {
            streamMode: "PROVISIONED"
        },
        tags: {
            Environment: "dev",
        }
    });
}

export function createKinesisAnalysticsApp(name: string, kinesisStream: aws.kinesis.Stream, role: aws.iam.Role): aws.kinesis.AnalyticsApplication {
    return new aws.kinesis.AnalyticsApplication(name.replace("_", "-"), {
        inputs: {
            namePrefix: `${name}_prefix`,
            kinesisStream: {
                resourceArn: kinesisStream.arn,
                roleArn: role.arn
            },
            parallelism: {
                count: 1,
            },
            schema: {
                recordColumns: [
                {
                    mapping: "$.id",
                    name: "id",
                    sqlType: "INT"
                },
                {
                    mapping: "uid",
                    name: "uid",
                    sqlType: "VARCHAR(100)"
                },
                {
                    mapping: "brand",
                    name: "brand",
                    sqlType: "VARCHAR(20)"
                },
                {
                    mapping: "equipment",
                    name: "equipment",
                    sqlType: "VARCHAR(255)"
                },
                
            ],
            recordFormat: {
                mappingParameters: {
                    json: {
                        recordRowPath: "$",
                    }

                },
            },
            recordEncoding: "UTF-8"
            }
        }
    })
}

