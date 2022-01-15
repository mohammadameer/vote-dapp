const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vote Contract Main Stories", function () {

  let voteContract;
	let owner;
	let addr1;
	let addr2;

	beforeEach(async () => {
		[owner, addr1, addr2] = await ethers.getSigners();

		const VoteContract = await ethers.getContractFactory(
			"Vote", owner
		);
		voteContract = await VoteContract.deploy();
		await voteContract.deployed();

	})
  
  it("commission officers should be able to add new party.", async function() {
    expect(voteContract.politicalParties.length).to.equal(0)
    
    const newPoliticalPartyTxn = await voteContract.addPoliticalParty("Political Party 1", "Political party president");

    await newPoliticalPartyTxn.wait();

    const politicalPartiesTxn = await voteContract.getAllPoliticalParties();

    expect(politicalPartiesTxn.length).to.equal(1);
    expect(politicalPartiesTxn[0].partyName).to.equal("Political Party 1");
    expect(politicalPartiesTxn[0].presidentName).to.equal("Political party president");
  })

  it("user should not be able to vote for a party when elections did not start yet.", async function() {
    expect(voteContract.politicalParties.length).to.equal(0)
    
    const newPoliticalPartyTxn = await voteContract.addPoliticalParty("Political Party 1", "Political party president");

    await newPoliticalPartyTxn.wait();

    await expect(voteContract.connect(addr1).vote(0)).to.be.reverted;

    const politicalPartiesTxn = await voteContract.getAllPoliticalParties();

    expect(politicalPartiesTxn[0].votes).to.equal(0);
  })

  it("user should be able to vote for a party when elections did start only once.", async function() {
    expect(voteContract.politicalParties.length).to.equal(0)
    
    const newPoliticalPartyTxn = await voteContract.addPoliticalParty("Political Party 1", "Political party president");

    await newPoliticalPartyTxn.wait();

    let date = new Date();

    let startDate = parseInt(date.getTime() / 1000);

    let endDate = parseInt(new Date (date.setDate(date.getDate() + 2)) / 1000);

    const startDateTxn = await voteContract.setStartDate(startDate);

    await startDateTxn.wait()

    const endDateTxn = await voteContract.setEndDate(endDate);

    await endDateTxn.wait();

    const voteTxn =  await voteContract.connect(addr1).vote(0);

    await voteTxn.wait();
    
    const politicalPartiesTxn = await voteContract.getAllPoliticalParties();
    
    expect(politicalPartiesTxn[0].votes).to.equal(1);

    await expect(voteContract.connect(addr1).vote(0)).to.be.reverted;
  })

  it("user should be able to cast his vote for another user.", async function() {
    expect(voteContract.politicalParties.length).to.equal(0)
    
    const newPoliticalPartyTxn = await voteContract.addPoliticalParty("Political Party 1", "Political party president");

    await newPoliticalPartyTxn.wait();

    let date = new Date();

    let startDate = parseInt(date.getTime() / 1000);

    let endDate = parseInt(new Date (date.setDate(date.getDate() + 2)) / 1000);

    const startDateTxn = await voteContract.setStartDate(startDate);

    await startDateTxn.wait()

    const endDateTxn = await voteContract.setEndDate(endDate);

    await endDateTxn.wait();

    const castVoteTxn = await voteContract.connect(addr2).castVote(addr1.address);
    
    await castVoteTxn.wait();

    const userVotesTxn = await voteContract.getUserVotes(addr1.address);

    expect(userVotesTxn).to.equal(-1)

    const voteTxn =  await voteContract.connect(addr1).vote(0);

    await voteTxn.wait();

    const voteTxn2 =  await voteContract.connect(addr1).vote(0);

    await voteTxn2.wait();
    
    const politicalPartiesTxn = await voteContract.getAllPoliticalParties();
    
    expect(politicalPartiesTxn[0].votes).to.equal(2);

    await expect(voteContract.connect(addr1).vote(0)).to.be.reverted;
  })
});
