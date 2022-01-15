async function main() {
  const VoteContract = await ethers.getContractFactory("Vote");
  const voteContract = await VoteContract.deploy();

  await voteContract.deployed();

  console.log("voteContract address:", voteContract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

runMain();
