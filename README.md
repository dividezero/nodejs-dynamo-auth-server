<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/dividezero/nodejs-dynamo-auth-server">
    <img src="http://crocodillon.com/images/blog/2015/asynchronous-callbacks-in-koa--twitter.png" alt="Logo" width="240px" >
  </a>

  <h3 align="center">Oauth2 Authentication Server</h3>

  <p align="center">
    An awesome Oauth2 authentication server built on NodeJs, DynemoDb and Cognito
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- yarn or npm

```sh
brew install yarn
```

### Development

#### Run

```zsh
# Run normally
$ yarn start
# Run the application with nodemon for development
$ yarn dev
```

#### Test

```zsh
# Test
$ yarn test                           # Run all test
$ yarn test:unit                      # Run only unit test
$ yarn test:integration               # Run only integration test
# Test (Watch Mode for development)
$ yarn test:watch                     # Run all test with watch mode
$ yarn test:watch:unit                # Run only unit test with watch mode
$ yarn test:watch:integration         # Run only integration test with watch mode
# Test Coverage
$ yarn test:coverage                  # Calculate the coverage of all test
$ yarn test:coverage:unit             # Calculate the coverage of unit test
$ yarn test:coverage:integration      # Calculate the coverage of integration test
# Test consistent coding style (Lint)
$ yarn lint                           # Lint all sourcecode
$ yarn lint:app                       # Lint app sourcecode
$ yarn lint:test                      # Lint test sourcecode
```

#### Archive

```zsh
$ yarn pack
```

### Test

All test for this boilerplate uses following tools.

- [Jest](https://github.com/facebook/jest)
- [supertest](https://github.com/visionmedia/supertest) - Easy HTTP assertions for integration test

### DynamoDB Local

I recommend using instructure's dynamo local with an admin page to manage the local dynamoDB instance
```zsh
docker run -p 8000:8000 -it --rm instructure/dynamo-local-admin
```

<!-- USAGE EXAMPLES -->

## Usage

Note that communication in transit to and from this app should be encrypted using TLS

All POST body contents are in `application/json` format

POST `/user`

- `email`: New user email
- `password`: New user password

POST `/user/verify`

- `email`: User email
- `token`: Token created on user creation. This should be emailed to the user

POST `/user/login`

- `email`: User email
- `password`: User password

POST `/user/password/forgot`

- `email`: User email

POST `/user/password/reset`

- `email`: User email
- `lostToken`: Token created on forgot password. This should be emailed to the user
- `newPassword`: New password after reset

POST `/user/password/change`

- `email`: User email
- `password`: Old password
- `newPassword`: New password


<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/dividezero/nodejs-dynamo-auth-server/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Based off [danilop's LambdAuth](https://github.com/danilop/LambdAuth)

Started using [posquit0's Koa Boilerplate](https://github.com/posquit0/koa-rest-api-boilerplate)

<!-- CONTACT -->

## Contact

Your Name - [@hazlanrozaimi](https://twitter.com/hazlanrozaimi) - hazlan.rozaimi@gmail.com

Project Link: [https://github.com/dividezero/nodejs-dynamo-auth-server](https://github.com/dividezero/nodejs-dynamo-auth-server)

