# [GraphQL](https://cmr.earthdata.nasa.gov/graphql)

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

## About
GraphQL is an api developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to search against [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) concept metadata using [GraphQL](https://graphql.org/).

## License

> Copyright © 2007-2020 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation

Before running the application you'll want to ensure that all necessary packages are installed by running:

    npm install

GraphQL uses a few environment variables for configuring runtime options:

|Variable Name|Default|Description|
|-|:-:|-|
|CMR_ROOT_URL||URL to ping when retrieving metadata e.g. https://cmr.earthdata.nasa.gov|
|LAMBDA_TIMEOUT|30|Number of seconds to set the Lambda timeout to.|

### Serverless Framework

The local development environment for the static assets can be started by executing the command below in the project root directory:

    serverless offline

This will run the application at [http://localhost:3003/dev/api](http://localhost:3003/dev/api)

## Usage

Currently, this API supports searching and retrieving data for [Collections](#collections), [Granules](#granules), [Services](#services), [Tools](#tools) and [Variables](#variables).

#### Optional Headers

GraphQL supports a few optional headers that can be used for various features and debugging purposes.

##### Authentication

GraphQL accepts [Earthdata Login (EDL)](https://urs.earthdata.nasa.gov/) tokens via the `Echo-Token` header or the `Authorization` header. If provided, these tokens will be provided to any CMR call made as part of the query. GraphQL will return errors if the token is invalid or expired in which case the client will need to handle the response accordingly.

##### Identification

In order for us to best provide debugging, statistics, and to inform us of future feature work GraphQL accepts the `Client-Id` header that allows all clients to identifiy themselves. If provided, this value is passed to any CMR call made as part of the query and is used to determine usage patterns, helps debug issues by filtering down logs, and also will help determine priority of feature requests.

##### Request Tracking

Logging is key to debugging, and to ensure that we can provide the best support to users' when issues may arise, GraphQL supports the `X-Request-Id` header. This header will be passed to any CMR call made as part of the query which will be prepended to any CMR logs that are generated as a result of a query. This value is also used in GraphQL logs so that we can associate our logs, CMR logs, and any logs you may have if debugging becomes necessary. We recommend setting this value with all requests in the event it is needed, it cannot be added retroactively.


#### Queries

When querying for multiple items there are three high level parameters that can be provided, `count`, `cursor` and `items`. 

##### Count

`count` will hold the value returned from the CMR header `CMR-Hits` for the respective concept type providing the total number of results (ignoring the current page size). 

##### Cursor

`cursor` tells CMR that you'd like to initiate a scroll session with the intent of harvesting data. If you request this key without providing cursor as a search parameter GraphQL will ask CMR to start a new scroll session and return the value as a cursor in the response. To take advantage of the cursor you can then include it in subsequent queries until no data is returned. 

###### First Request:

    {
      concept {
        count
        cursor
        items {
          conceptId
        }
      }
    }
    
Which will return something similar to the following:

    {
      "data": {
        "concept": {
          "count": 2483,
          "cursor": "eyJqc29uIjoiLTQ2OTA0MDY3NyJ9=",
          "items": [
            {
              "conceptId": "C1000000001-EXAMPLE"
            },
            ...
        }
      }
    }
    
###### Subsequent Requests

    {
      concept(cursor: "eyJqc29uIjoiLTQ2OTA0MDY3NyJ9=") {
        count
        cursor
        items {
          conceptId
        }
      }
    }
    
A couple of things to keep in mind when using a cursor

1. Subsequent queries will **not** accept new parameters, the search parameters provided in this initial query are used for *all* subsequent queries using the returned cursor value.
2. Subsequent queries must be made **sequentially** (as of August 21, 2020) as the version of Elastic Search CMR uses does not support parallel queries using the same cursor value.
    


##### Items

`items` is where you will provide the columns you'd like returned from CMR.

    {
      concept {
        count
        items {
          conceptId
        }
      }
    }

If you're querying single objects `count` is not available and therefore `items` isn't necessary -- you can simply list the columns you'd like returned from CMR as a direct child of your query.

    {
      concept {
        conceptId
      }
    }

Note that the response you get will match the structure of your query, meaning that in the event you've requested data from a list query you'll receive the results in an `items` array whereas with a single query request you will not.


#### Collections

A subset of supported arguments will automatically be sent to immidiately adjacent granule queries, for a list of those arguments see [Passthrough Arguments](#passthrough-arguments).

For all supported arguments and columns, see [the schema](src/types/collection.graphql).

##### Example Queries

###### Single

    {
      collection(conceptId:"C1000000001-EXAMPLE") {
        title
        granules {
          count
          items {
            conceptId
            title
          }
        }
        services {
          count
          items {
            conceptId
            type
          }
        }
        tools {
          count
          items {
            conceptId
            supportedBrowsers
          }
        }
        variables {
          count
          items {
            conceptId
            name
          }
        }
      }
    }

###### Multiple

    {
      collections(
        conceptId:["C1000000001-EXAMPLE", "C1000000002-EXAMPLE"]
      ) {
		count
        items {
          title
          granules {
            count
            title
          }
          services {
            count
            items {
              conceptId
              type
            }
          }
          tools {
            count
            items {
              conceptId
              supportedBrowsers
            }
          }
          variables {
            count
            items {
              conceptId
              name
            }
          }
        }
      }
    }

#### Granules

For performance reasons, CMR requires that a collection be provided in order to query granules. While CMR supports multiple aliases for the collection GraphQL requires that it be called `collectionConceptId`; if this is not provided CMR will return an error. We don't enforce this in the schema because you can also use `conceptId` if you're looking for specific granules and schemas don't offer a means of offering conditional validations.

##### Passthrough Arguments

A subset of the supported arguments for [Collections](#collections) will be passed through to the granule query by default. Those arguments are as follows:

- boundingBox
- circle
- point
- polygon
- temporal

For all supported arguments and columns, see [the schema](src/types/granules.graphql).

##### Example Queries

###### Single

    {
      granule(conceptId:"G1000000001-EXAMPLE") {
        conceptId
        title
      }
    }

###### Multiple

    {
      granules(collectionConceptId:"G1000000001-EXAMPLE") {
        items {
          conceptId
          title
        }
      }
    }


#### Services

For all supported arguments and columns, see [the schema](src/types/service.graphql).

##### Example Queries

###### Single

    {
      service(conceptId:"S1000000001-EXAMPLE") {
        conceptId
        type
      }
    }

###### Multiple

    {
      services {
        count
        items {
          conceptId
          type
          description
        }
      }
    }


#### Tools

For all supported arguments and columns, see [the schema](src/types/tool.graphql).

##### Example Queries

###### Single

    {
      tool(conceptId:"T1000000001-EXAMPLE") {
        conceptId
        scienceKeywords
        supportedBrowsers
      }
    }

###### Multiple

    {
      tools {
        count
        items {
          conceptId
          toolKeywords
          supportedBrowsers
        }
      }
    }

#### Variables

For all supported arguments and columns, see [the schema](src/types/variable.graphql).

##### Example Queries

###### Single

    {
      variable(conceptId:"V1000000001-EXAMPLE") {
        conceptId
        scienceKeywords
        variableType
      }
    }

###### Multiple

    {
      variables {
        count
        items {
          conceptId
          scienceKeywords
          variableType
        }
      }
    }
