// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Recorder } from "@azure-tools/test-recorder";
import { Context } from "mocha";
import { createClient, createRecorder } from "./utils/recordedClient";
import { AnomalyDetectorRestClient, isUnexpected } from "../../src";
import { assert } from "chai";

describe("AnomalyDetectorClient", () => {
  let recorder: Recorder;
  let client: AnomalyDetectorRestClient;

  beforeEach(async function (this: Context) {
    recorder = await createRecorder(this);
    client = await createClient(recorder);
  });

  afterEach(async function () {
    if (recorder) {
      await recorder.stop();
    }
  });

  it("should detect changes", async function () {
    const series = [
      { timestamp: "2018-03-01T00:00:00.000Z", value: 32858923 },
      { timestamp: "2018-03-02T00:00:00.000Z", value: 29615278 },
      { timestamp: "2018-03-03T00:00:00.000Z", value: 22839355 },
      { timestamp: "2018-03-04T00:00:00.000Z", value: 25948736 },
      { timestamp: "2018-03-05T00:00:00.000Z", value: 34139159 },
      { timestamp: "2018-03-06T00:00:00.000Z", value: 33843985 },
      { timestamp: "2018-03-07T00:00:00.000Z", value: 33637661 },
      { timestamp: "2018-03-08T00:00:00.000Z", value: 32627350 },
      { timestamp: "2018-03-09T00:00:00.000Z", value: 29881076 },
      { timestamp: "2018-03-10T00:00:00.000Z", value: 22681575 },
      { timestamp: "2018-03-11T00:00:00.000Z", value: 24629393 },
      { timestamp: "2018-03-12T00:00:00.000Z", value: 34010679 },
      { timestamp: "2018-03-13T00:00:00.000Z", value: 33893888 },
      { timestamp: "2018-03-14T00:00:00.000Z", value: 33760076 },
      { timestamp: "2018-03-15T00:00:00.000Z", value: 33093515 },
      { timestamp: "2018-03-16T00:00:00.000Z", value: 29945555 },
      { timestamp: "2018-03-17T00:00:00.000Z", value: 22676212 },
      { timestamp: "2018-03-18T00:00:00.000Z", value: 25262514 },
      { timestamp: "2018-03-19T00:00:00.000Z", value: 33631649 },
      { timestamp: "2018-03-20T00:00:00.000Z", value: 34468310 },
      { timestamp: "2018-03-21T00:00:00.000Z", value: 34212281 },
      { timestamp: "2018-03-22T00:00:00.000Z", value: 38144434 },
      { timestamp: "2018-03-23T00:00:00.000Z", value: 34662949 },
      { timestamp: "2018-03-24T00:00:00.000Z", value: 24623684 },
      { timestamp: "2018-03-25T00:00:00.000Z", value: 26530491 },
      { timestamp: "2018-03-26T00:00:00.000Z", value: 35445003 },
      { timestamp: "2018-03-27T00:00:00.000Z", value: 34250789 },
      { timestamp: "2018-03-28T00:00:00.000Z", value: 33423012 },
      { timestamp: "2018-03-29T00:00:00.000Z", value: 30744783 },
      { timestamp: "2018-03-30T00:00:00.000Z", value: 25825128 },
      { timestamp: "2018-03-31T00:00:00.000Z", value: 21244209 },
      { timestamp: "2018-04-01T00:00:00.000Z", value: 22576956 },
      { timestamp: "2018-04-02T00:00:00.000Z", value: 31957221 },
      { timestamp: "2018-04-03T00:00:00.000Z", value: 33841228 },
      { timestamp: "2018-04-04T00:00:00.000Z", value: 33554483 },
      { timestamp: "2018-04-05T00:00:00.000Z", value: 32383350 },
      { timestamp: "2018-04-06T00:00:00.000Z", value: 29494850 },
      { timestamp: "2018-04-07T00:00:00.000Z", value: 22815534 },
      { timestamp: "2018-04-08T00:00:00.000Z", value: 25557267 },
      { timestamp: "2018-04-09T00:00:00.000Z", value: 34858252 },
      { timestamp: "2018-04-10T00:00:00.000Z", value: 34750597 },
      { timestamp: "2018-04-11T00:00:00.000Z", value: 34717956 },
      { timestamp: "2018-04-12T00:00:00.000Z", value: 34132534 },
      { timestamp: "2018-04-13T00:00:00.000Z", value: 30762236 },
      { timestamp: "2018-04-14T00:00:00.000Z", value: 22504059 },
      { timestamp: "2018-04-15T00:00:00.000Z", value: 26149060 },
      { timestamp: "2018-04-16T00:00:00.000Z", value: 35250105 },
    ];

    const result = await client.path("/timeseries/changepoint/detect").post({
      body: {
        series,
        granularity: "daily",
      },
    });

    if (isUnexpected(result)) {
      throw result.body;
    }

    assert.deepEqual(result.body.isChangePoint?.filter((p) => p).length, 2);
  });

  it("should get multivariate models", async () => {
    const result = await client
      .path("/multivariate/models")
      .get({ queryParameters: { skip: 0, top: 10 } });

    if (isUnexpected(result)) {
      throw result.body;
    }

    assert.lengthOf(result.body.models, 2);
  });
});
