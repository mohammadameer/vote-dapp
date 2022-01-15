# vote system smart contract

## this smart contracts has this features

- the owner can add new political parties

- the owner set the start and end date and also can pause voting and casting if any problem happened

- user can vote for a political party once and only when its not paused and the start and end   date have been added

- use can cast their vote to another user

## how to use the smart contract

- fork the repo

- add `.env` file and copy vars from `.env.example` add you private key and alchemy or infora api key - make sure to add your `.env` file to gitignore, if you didn't you will lose your savings on the wallet it also safier to create new empty wallet and use it

- now just run `npx hardhat run scripts/deploy.js --network repston`

- the contract address will be logged you can see your contract on etherscan

- you can run `npx hardhat test` to run the test, you can also add and edit test in test file

## features that could be added

- the contract con be more decentralized, instead of owner create parties any user can create a party and maybe add some Conditions like votes can only happen when the party reach some count of people

- add the frontend 

- create a subgraph on the graph protocolo to make it easy to filter events and aggregate them