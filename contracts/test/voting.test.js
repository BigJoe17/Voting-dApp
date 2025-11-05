const { expect } = require("chai");

describe("VotingContract", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("VotingContract");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("deploys and sets owner", async function () {
    expect(await voting.owner()).to.equal(owner.address);
  });

  it("owner can add candidates and users can vote during election", async function () {
    await voting.addCandidate("Alice", "cid-alice");
    await voting.addCandidate("Bob", "cid-bob");

    const ids = await voting.getCandidateIds();
    expect(ids.length).to.equal(2);

    await voting.startElection(60); // 60 seconds

    await voting.connect(addr1).vote(1);

    const candidate1 = await voting.getCandidate(1);
    // candidate1 is a tuple (id, name, imageCID, voteCount)
    expect(candidate1[3]).to.equal(1);

    // addr1 cannot vote again
    await expect(voting.connect(addr1).vote(1)).to.be.revertedWith("Already voted");

    // end election
    await voting.endElection();
    expect(await voting.getElectionState()).to.equal(2);
  });
});
