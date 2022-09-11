package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/kinesis"
)

const (
	streamName = "appliances_stream"
	partitionKey = "p_key1"
)

type KinesisPutRecordAPI interface {
	PutRecord(ctx context.Context,
		params *kinesis.PutRecordInput,
		optFns ...func(*kinesis.Options))  (*kinesis.PutRecordOutput, error)
}

func MakePutRecord(c context.Context, api KinesisPutRecordAPI, input *kinesis.PutRecordInput) (*kinesis.PutRecordOutput, error) {
	return api.PutRecord(c, input)
}

func produce(client *kinesis.Client) {
	response, err := http.Get("https://random-data-api.com/api/v2/appliances")
	if err != nil {
		log.Fatal(err)
	}

	defer response.Body.Close()

	// read data from API
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	// prepare data to send it to Kinesis Stream
	input := &kinesis.PutRecordInput{
		Data: body,
		PartitionKey: aws.String(partitionKey),
		StreamName: aws.String(streamName),
	}

	// send data
	results, err := MakePutRecord(context.TODO(), client, input)
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Println(results.SequenceNumber)

}

func health(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got / request\n")
	w.Write([]byte("Healthy!"))
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	client := kinesis.NewFromConfig(cfg)

	go func() {
		for {
			fmt.Println("Producing...")
			produce(client)
			time.Sleep(time.Millisecond * 1)
		}
	}()

	http.HandleFunc("/healthz", health)
	err = http.ListenAndServe(":4449", nil)
	if err != nil {
		log.Panic(err)
	}

}