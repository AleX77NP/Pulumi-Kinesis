import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { createKinesisAnalysticsApp, createKinesisStream } from './resources/kinesis'
import { attackPolicyToReadStreams, createKinesisAnalyticsRole } from './resources/role'

// create Kineses data stream
const devStream = createKinesisStream("appliances_stream");

// create Kinesis analytics app
const analyticsRole = createKinesisAnalyticsRole("StreamReader") // role to read from stream
const devAnalytics = createKinesisAnalysticsApp("appliances_analytics", devStream, analyticsRole);
attackPolicyToReadStreams(analyticsRole);