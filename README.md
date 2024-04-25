# Nasus
![Nasus Banner](./assets/banner.png)

Nasus is a League of Legends Data Scraper that uses the Riot API to gather data on champions, items, and players.
Nasus provides all the data to use in Sion, a League of Legends Statistics and Analysis tool.

## Installation
We use Bun, a Javascript runtime environment to run Nasus. To read more about Bun, visit the [Bun Documentation](https://bun.sh/).

Clone the repository and install the dependencies:
```shell
bun install
```

## Prerequisites
To use Nasus, you need to have a **Riot API key**. You can get one by visiting the [Riot Developer Portal](https://developer.riotgames.com/).
Put your API key in the .env file in the root directory of the project.

In adition, Nasus use **MongoDB** to store the data. You need to have a MongoDB server running on your machine. You can download MongoDB from the [MongoDB Download Center](https://www.mongodb.com/try/download/community).

You will also need to create a .env file in the root directory of the project with the following content:
```shell
RIOT_API_KEY=RGAPI-********-*******-*******-******
MONGO_URI=mongodb://localhost:27017/nasus
```

## Usage
To run Nasus, use the following command:
```shell
bun run start
```

### How it works
Nasus will fetch a list of 10 recent matches from a initial player. Then, it will fetch the data of all the players in those matches. It will repeat this process for each player in the list, in a recursive way.

You can change the initial player in the `src/index.ts` file.

## Roadmap
- [x] Fetch data from the Riot API
- [x] Store data in a MongoDB database
- [x] Add error handling and retries
- [ ] Add support for more regions
- [ ] Dockerize the application
- [ ] Add tests

> [!NOTE]
> Nasus is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc
