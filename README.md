# exchange-rate
exchange rate service

---------------------

## Problem

We want to create a service that gives the latest and historical exchange rate data.

## Problem Analysis

We think that the need of exchange rate service may come from several sides:
- The needs from external customers. (B2C)
- The needs from external business partners. (B2B/B2B2C)
- The needs from internal business/applications.

Base on the problem and the needs, we want to design a solution which can try to serve different needs.

For external customers, we would assume their need can be fulfilled with an online exchange rate checking web page.

For external business partners, we think that the need is more on integrations. So, we would provide a clean API solution to them. And since it is external integration, we would need API gateway in between as guard.

For internal needs, we think that service reusability is our concerned value. So, we want to create a reusable microservice.

## Resource and Constraint

- 1 developer with 3-5 man days to deliver a prototype
- Free exchange rate API but have very limited quotas
- We have no budget

## Solution

Since I am more a backend guy, I want to solve this challenge which focus on backend stack. But from the problem solving prespective, a full stack solution is more applicable for this problem.

So, I would provide a full stack solution, but I would state that **I would choose to more focus to the backend side**.

### What we would include

We would provide an online webpage which allow users to check currency exchange rate data which serve for external customers' need.

And behind that, we would create a exchange rate microservice which can be reusable by our company's other products.

And between the online webpage and our microservice, we would build a intermediate buffer layer.
Because we have budet/resource limitation, this layer can make sure we can leverage our limited resource to deliver an endurable solution.

### What we would not included

Potentially, we can build an exposure API layer on top of our system API layer microservice. This would be fulfilling business partner integration needs. However, we have not enough resource so we would not able to deliver this part in this prototype project.

---------------------

## Architecture

### Ultimate Architecture

![Ultimate Architecture](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/ultimate_architecture.png)

- Presentation Layer
    - The client side webpage/browser.
- Frontend Server Layer
    - This is the fronend server to serve client services
- Buffer Layer
    - This layer is buffering the large service requests from Frontend layer
- System Microservice
    - The system API. And reusable for other products

### Simplified Architecture for prototype

![Prototype Architecture](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/prototype_architecture.png)

We would not implement all things in the Ultimate picture in this prototype project due to resource constraint:
- No network routing, no explicit take care of firewalls, etc
- Frontend Server only start 1 instance
- Back Server only start 1 instance
- Microservice only start 1 instance
- No API gateway

### Logic Flow for query historical data

![Logic Flow for query historical data](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/logic_flow_query_historical_data.png)

### Logic Flow for query latest data

![Logic Flow for query latest data](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/logic_flow_query_latest_data.png)

---------------------

## Design

### Exchange Rate Microservice Module Design

The module is wrapping a mini library.
The mini library containing methods to manage the microservices to control start/stop.

![Exchange Rate Microservice Module Design](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/microservice_module_design.png)

#### Service Implementation & Dependency problem

There are many internal services needed in the microservice code. For example, logging, data store.
Of cause we may provide concrete implementation for each services, but we may difficult to extend/maintain the code in future.

#### Use Service Provider to abstract and decouple service implementation

So, we design a serice provider pattern to resolve the problem. All code which need to use a certain service s would only depends on the service interface but not service implmentation. The code would ask for a service interface and get service instance from service provider. Service provider would manage the service implmentation mapping.

![Service Provider](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/service_provider.png)

#### Future extensibility and maintence

With the serviec provider to abstract and decouple service implementation, it makes the code easier to maintain.

Let's say, we have some function which need to use a key-value store. Actually to separate responsibility, that function should not concern about the key-value store implementation.

Today we may use MySQL for key-value store, tomorrow we may switch to use Redis. Typically, the changes is only adding a Redis implementation of the key-value store interface, and switch the dependency injection.

---------------------

### Presentation UI, Front Server and Back Server Design

Since I am more focus to backend stack so I would not talk much here.

#### Presentation UI

The webpage presentation UI have two parts.
1. UI to allow user to search and show exchange rate historical data (Sync flow)
2. A Table to keep showing the latest exchange rate data. It would keep refreshing around every 5-10 seconds. (Regular Async updates)

#### Front Server

- Front server would serve client side webpage traffic (HTML, JS, AJAX).

- Query Latest Data:

    - Front server would use websocket to connect with clients for server push latest exchange rate data to clients.
    - Front server would use pub/sub to publish request message to indicate that there is demand in knowing latest exchange rate data.
    - Front server would use pub/sub to subscribe topic of getting latest exchange rate data.

- Query Historical Data:

    - Front server would direct call microservice API.

#### Back Server

- Back server would use pub/sub to subscribe topic which knowing the message that there is demand in knowing latest exchange rate data.
- Back server would user pub/sub to publish latest exchange rate data.

---------------------

### Service Availability

Since that our microservice is relying on free external exchange rate API which has limited API quotas.
If we do not have measurements to reduce API call, we would easily used up all quota and then the service would be down.

To reduce API call, we have the below design

1. Historical Exchange Rate Data would only call external API once and then store in DB to serve later calls.
2. Caching Latest Exchange Rate Data in DB for 5 minutes.
3. Although Frontend may driven many request to query latest exchange rate data, our Back server would  aggregate the requests to call microservice once every a short interval.

### Scalability

The microservice is stateless. Data store/cache is stored in DB. So the microservice is horizontal scalable.

### Tradeoff 

For query historical data, we choose to use direct API call.
For query latest exchange rate data, we choose to use pub/sub async flow.

The reason for above different is that, we expect that historical data query should be more a sync flow with much less requests.
While, the latest data query should be more a async flow with much more requests.

With the difference situation and balance between complexity, we choose to use the existing approaches.

---------------------

## REST API

Spec:

Open API spec can be found in project file: "exchange-rate-microservice/openAPI-spec.yaml"

Document

- Getting Exchange Rate Latest Data

Path: /exchangeRates/{baseCurrency}/latest

Method: GET

Sample Request:

```
GET http://exchange-rate-microservice.airic-yu.com/api/v1.0/exchangeRates/usd/latest
```

Sample Response: 

```
HTTP/1.1 200 OK
Server: nginx
Date: Sat, 30 Jun 2018 16:16:40 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Vary: Accept-Encoding
X-Powered-By: Express
ETag: W/"97c-IZEbd/LoE4tqZmz7Qs8WomlYlxI"
Content-Encoding: gzip

{
  "error": null,
  "data": {
    "AED": 3.673014,
    "AFN": 73.307069,
    ...
    "ZMW": 9.949,
    "ZWL": 322.355011
  }
}
```

- Getting Exchange Rate Historical Data

Path: /exchangeRates/{baseCurrency}/historical/2018-06-26

Method: GET

Sample Request:

```
GET http://exchange-rate-microservice.airic-yu.com/api/v1.0/exchangeRates/usd/latest
```

Sample Response: 

```
HTTP/1.1 200 OK
Server: nginx
Date: Sat, 30 Jun 2018 16:18:27 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Vary: Accept-Encoding
X-Powered-By: Express
ETag: W/"a0a-gs20/G32ldN6K8XBW13h5Eq7xck"
Content-Encoding: gzip

{
  "error": null,
  "data": {
    "AED": 3.673181,
    "AFN": 72.344322,
    ...
    "ZMW": 10.027879,
    "ZWL": 322.355011
  }
}
```

---------------------

## TODO list

- API call error should add retry.
- Currently the microservice is concretely defined to call external API. We should decoupled it as an abstract agent.
- Use winston logger instead of console log as logger service implementation.
- We may log more working state message, and potentially can stream log for analysis. Currently there is lack of monitoring.
- Make use of API gateway in front of microservice. With API gateway, we can :
    - Guarding API consumer with API key.
    - We can track API call usages.
    - We can set API call quota limitations
- We did not add much testing but only some manual end to end testing. Actually if having more time, we can write more detail unit test which can be automate.
- The Front and Back server have some hardcoded remote endpoint URL in code. This should be replaced by config properties instead.

---------------------

## Technical Choices

Language: Node.js

External API type: REST API (with open API spec 3.0 defined)

HTTP server: express.js

Data Storage: MySQL (for simplicity)

Exchange rate data source: openexchangerates.org

---------------------

Boilerplate code reference:

https://github.com/theturtle32/WebSocket-Node

---------------------

Server Hosting

http://exchange-rate-front.airic-yu.com/

Web page screenshot:

![Screenshot](https://raw.githubusercontent.com/airicyu/exchange-rate/master/images/exchange_rate_webpage_demo_screenshot.png)


Remarks:

Originally I want to deploy to Google App Engine, but seems there is some connection setting issue with Google App Engine's MySQL server.
Hence as fallback, I hosted the apps in my rented server instead.
