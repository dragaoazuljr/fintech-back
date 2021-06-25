<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) API for a fintech bank, with login, dashboard and transactions.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# config .env file using the .env.model
$ cp .env.model .env

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Arquitetura

<a href="https://viewer.diagrams.net/?highlight=FF4545&edit=_blank&layers=1&nav=1&title=fintech-arquitetura#R7Vxbd9o4EP41PHYPvmHyCOR22rRlN%2FR025cexSi2GmOxslwgv34lLOGLBJgEY9L6oafW%2BIL9fTOjb0Z2OtZotrwhYB58xFMYdszudNmxLjumaXZ7JvuPW1apxZUGn6BpajIywz16hsLYFdYETWFcOJBiHFI0Lxo9HEXQowUbIAQvioc94rD4q3PgQ8Vw74FQtX5FUxqk1r7pZvZbiPxA%2FrLRu0j3zIA8WDxJHIApXuRM1lXHGhGMabo1W45gyMGTuKTnXW%2FZu7kxAiNa5YTv4%2BTnJPiA3L%2BXtwYaPvlffOOduNlfIEzEAw%2BB9wSjKTO%2BY%2F8YoUnI8E%2BfgK4kLPECzUIQsdFQvQ9xa78goXCZM4n7uoF4BilZsUPE3r6ASPiI3RXjRYa4JR0iyKFtWsIIBMv%2B5tIZEGxDYHEALvLXcsB8iSFRgSA4iaaQX8pgWCwCROH9HHh874JFBLMFdBaK3SpUO0mpjJ9ZxM9R4TNMDXy92tCzFZzglIWVGGJCA%2BzjCIRXmXWYIdllo%2ByYO4znAr%2BfkNKVyBEgobiILlwi%2Bi8%2F%2FS9HjL6Ji%2FHty2V%2BsJKDiD1v7iQ%2B%2FCavxwfZaeuRPO8wJmOcEA%2FuAkymNkB8uOuC0i85nDs9g8AQUPSrmMWOT7QM9SxM7rCPojcRJoZ9wjgZfH7%2BPB5cXNMPj2Z88%2Blq%2BOPq8Z3VbJi4%2BTgxqsaJWwiU7okDxVIDRQutcV5xYilxQgmIYuBRhKMznVUMt7lpRcup2c4q24JlVwzsn1SspoJl123nYmWOlm8jRE46pei5VBX9NcERPbWkt%2B2XanqzLmjMJjW98eZFvfSBPz79GlXFimlWTMDmeal62dxohmkjz%2FOG9X1MFzRpRvvZMW0fm%2Bn1qQNCwCp3wByjiMa5K4%2B5ITdvOaV5yy31jvYc3%2B%2BWnCy9gczlNk%2FyCi80lXR9utry1em6eSVgNlxdvqi4rKO2rB7FdtUo7p1XvraVSLkEcfCAAZmeabQ0WVvqMXSajRb3RfLGbVbf9Bqb9V7HdU%2BJl5N3Y14fMmcww6i1poKdz8Cbq5hsqyc3C3ngQV6huxOV0tLRBoAcKJtStFBm1odKfz8qxcRxHI8yq3tUc%2BA0sjB0IID7m9DHzmZ60W11i75dJiVNu%2BKkEi9H0N9qG664NPwJxvT9aZLlAa6tV%2BNW46lSAfMjjnysoBcHYM43vVWIGIzE2o%2FhQwr43cPGwGjy1zR8Tii7DBT2OI0Pw6kT%2BHJhqRF2PQ3w%2FbqA%2F%2B2LoPVoDAlieEFymNI7NOPtF3q1ZMZDuxtlTeCcoFvRa9TPCi0zt2LPzCi4Wa6WeF35UNmpnIpOdV5LuY6SyUvrK4PIT0JAznRiLIuKxmdGV8HzdjIZK%2Bixx6NFiECI%2FIhPlQwinviGHATkgXAgdszQdJrGGWRTnygouCOL%2FMGu6ww7ziW%2FFgstOT3ymZIS%2FARHOMQ8oUZ4y6LYkSgxLspLZQoljk6k18WIWr8MEubfHFsPMMnSff918kfx03MK%2FPQ1IaNdyaxN06gLmQPyX8ISCk0IYDtuIAHhGVKUGuV7tFzbPrLUKaY3o6cl8eCV501KE3RdaOjSFr110eU03FqsX4NWZnGvJrCqKk2ZEc9EFVhqtczfLVCIz71ksQZN7OEgegEKp3dghRP%2B3DFlVZwcDQNM0DM7Hkh22W4iITd7hSPu%2BZnimuuwhWNJhFEyfQTLwoF3IKbybnAYgnmM0pDnJ84YJSgaYkrxbAvvanwfIZ5Lat7VvEiijWejtpfDLbWa%2F8FPGDBbkrCtLZlXmxMfURiWTDIth%2FCRapIy5RlgGDPtiCL%2Fbn3MpZ1Z%2FhEQcBNm5z6G668OApbKYbTOLBTQral8yEAb8fBnSd0csbGRjdd5fs5y0QhH7FkAWnMKmdMsIHecqlOwVd0HBOmyY783h%2Ffqolx9gTMCM5hyzrBguHdGZmfQbbk%2FNveO2TD3tiq34AygsEB%2BS%2FuRaXf7TYe8uqo%2BB3G8wESk%2BvvbgWOYbdjXw7%2FRtZt2ALXVMwqZB%2FB3Z7ubtZDKRdYWao9cYpUlWV5laj4ZfK0a67kaNVZXt2L%2ByQ3GLliiK2%2BSXP%2B4j8h3T3YHT1xcbemhVmuhlmqWl1VKtpgW91dKF00WRvI2c0E01rzN39ZFB0diuZN7BoWRrarktjA6YJbcBMvbKYxsVSUlvPHRcl4b580XROr7c09w1ZZDdZLeeDlkqwt1IXiAbRVcK%2B3NV0H2hcLqb%2FYx0PFWLyQxezW5fV4fEDhqh2uSvRDdivWjl8396ouS%2Fbo4V1esWq1%2BQC7fxMzb0epSOOYp52L9mvBgyIhnv88%2FzZZQtD5wPB9oXLs7qoxb%2B8AEt6FfH%2B2Nq3dH%2FVRnjpYt6XWS3rx2d9TmzBTGXluy1Uq77pXa09Ku9mfEJuddfi7Ukn5M0p0TijvtX01SFyu9hLDn9NrGXL3M908o6bQroKqqv2aPD71gG9m5PsuhvO9%2FU1j3YUOxHZQruO3NeNND0MOvKb%2B311lq%2Fu3rPmmQXB9ASId%2F7CH%2FYG%2F66VD2Z4%2Btq%2F8B">Link</a>

## License

Nest is [MIT licensed](LICENSE).
