# Express API for Ethereum balances

This repository contains an Express API for retrieving the Ether (ETH) balances of Ethereum addresses. The API uses the Alchemy RPC service to fetch balance information and provides a simple endpoint for querying multiple addresses at once.

The repository was done as part of [iYield Backend Challenge](https://github.com/iYieldCrypto/iyield-backend-challenge/tree/master)

## Task

Build a web server that allows the user to request the balance of ethereum addresses. The
response should should be a map of the supplied addresses to balances in ETH. The balances
should be formatted in a human-readable way:

```json
{
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045": "934.04",
    "0xedf37e7fc70a97c5d1752cd909e0183b5bd23b27": "0.007021",
    "whoops-this-isnt-a-valid-address": "0"
}
```

The rules for formatting the values are as follows:

-   always show at least 2 decimal places
-   always show at least 4 [significant figures](https://en.wikipedia.org/wiki/Significant_figures)
-   don't show more decimal places than required
-   after applying the above rules remove any trailing zeros after the decimal place
-   a comma should be used for the [thousands seperator](https://en.wikipedia.org/wiki/Decimal_separator#Digit_grouping)

For example:

| actual balance    | formatted balance |
| ----------------- | ----------------- |
| 0.000000123456789 | 0.0000001235      |
| 0.123456789000000 | 0.1235            |
| 1.234567890000000 | 1.235             |
| 12.34567890000000 | 12.35             |
| 123.4567890000000 | 123.46            |
| 1234.567890000000 | 1,234.57          |
| 1.200000000000001 | 1.2               |
| 1.000000000000001 | 1                 |
| 123456789.0000001 | 123,456,789       |

If the user supplies an invalid address the server should return a balance of `0`.

## Prerequisites

Before you start using this API, make sure you have the following prerequisites installed:

-   [Node.js](https://nodejs.org/): JavaScript runtime environment.
-   [npm](https://www.npmjs.com/): Node.js package manager.
-   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.

## Setup

Follow these steps to set up and run the Express API:

1. Clone this repository to your local machine:

    ```bash
     npm install
    ```

2. Create a `.env` file in the project root directory, based on the provided `.env.example`. Set the `ALCHEMY_RPC_URL` to your Alchemy API endpoint, and you can customize the `PORT` if needed.
3. Build the TypeScript code:

```bash
    npm run build
```

4. Start the server:

```bash
    npm start
```

## Development

```bash
    npm install
    npm run dev
```

## Endpoints
### `/balances`
**Method**: GET

**Parameters**: addresses (query parameter, comma-separated Ethereum addresses)

**Description**: Retrieve the balances of multiple Ethereum addresses. The API accepts a list of addresses as a query parameter and returns the balances in Ether (ETH) for each address.

Example request:

```bash
GET http://localhost:<port>/balances?addresses=0xAddress1,0xAddress2,0xAddress3
```

Example response:

```json
{
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045": "934.04",
  "0xedf37e7fc70a97c5d1752cd909e0183b5bd23b27": "0.007021",
  "whoops-this-isnt-a-valid-address": "0"
}
```