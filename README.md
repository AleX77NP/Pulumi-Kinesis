# AWS Kinesis with Pulumi

Program that helps setting up Kinesis playground on AWS using Pulumi.
Infrastructure is shown on the diagram below:

<img src="https://github.com/AleX77NP/Pulumi-Kinesis/raw/main/images/diagram.jpg">

Prerequisites:
===========================
Following things are required for this project:
- Node.js (TypeScript)
- Pulumi
- AWS account/sandbox
- AWS CLI installed
- Go programming language (same program can be written in any language)

Description:
===========================
This is a simple example how to provision Kinesis resources with Pulumi - AWS Kinesis DataStream that gets data
from Producer (Go app) that you can query in real time via AWS Kinesis Analytics Application.

Our producer fetcher random appliance data from `https://random-data-api.com/api/v2/appliances` api, 
and sends it to Kinesis DataStream every millisecond.
Metrics for this data are available on DataStream page:

<img src="https://github.com/AleX77NP/Pulumi-Kinesis/raw/main/images/stream.png">


After this, we use Kinesis Analytics App as our consumer, where we can write SQL queries
to analyze data in real time. We take incoming stream and create outgoing one, and we display our output
data:

<img src="https://github.com/AleX77NP/Pulumi-Kinesis/raw/main/images/analytics.png">

Folders and files:
===========================
- `index.ts` is the entry point for Pulumi program
- `resources/` is where our Kinesis services are defined
- `go-producer/` is our Producer that puts data into the stream
- `real-time-query.txt` is a text file with SQL query example

