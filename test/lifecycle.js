const BPool = artifacts.require('BPool');
const BFactory = artifacts.require('BFactory');
const TToken = artifacts.require('TToken');
const TTokenFactory = artifacts.require('TTokenFactory');

contract('BPool lifecycle', async (accounts) => {

  const admin = accounts[0];
  const toHex = web3.utils.toHex;
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  const MAX = web3.utils.toTwosComplement(-1);

  let tokens;           // token factory / registry
  let DIRT, ROCK, SAND; // addresses
  let dirt, rock, sand; // TTokens
  let factory;          // BPool factory
  let pool;             // first pool w/ defaults
  let POOL;             //   pool address

  const dirtBalance = toWei('10')
  const dirtDenorm = toWei('1.1');

  before(async () => {
    tokens = await TTokenFactory.deployed();
    factory = await BFactory.deployed();

    POOL = await factory.newBPool.call(); // this works fine in clean room
    await factory.newBPool();
    pool = await BPool.at(POOL);
    console.log("pool is ", POOL);

    await tokens.build(toHex("DIRT"));
    DIRT = await tokens.get.call(toHex("DIRT"));
    dirt = await TToken.at(DIRT);
    console.log("dirt is ", DIRT);

    await dirt.mint(MAX);
    console.log("dirt.mint(MAX);");
    await dirt.approve(POOL, MAX);
    console.log("dirt.approve(POOL, MAX);");
  });

  it('bind getNumTokens isBound', async () => {
    let isBound = await pool.isBound.call(DIRT);
    let numTokens = await pool.getNumTokens.call();
    assert( ! isBound);
    assert.equal(0, numTokens);

    await pool.bind(DIRT, dirtBalance, dirtDenorm);
    console.log("pool.bind(DIRT, dirtBalance, dirtDenorm);");

    isBound = await pool.isBound.call(DIRT);
    numTokens = await pool.getNumTokens.call();
    assert(isBound);
    assert.equal(1, numTokens);
  });


  it('bind ERR_NOT_CONTROLLER ERR_IS_BOUND ERR_IS_FINALIZED', async () => {
      throw 'unimplemented';
  });

  it('bind ERR_MAX_TOKENS', async () => {
      throw 'unimplemented';
  });

  it('unbind getNumTokens isBound', async () => {
    let isBoundBefore = await pool.isBound.call(DIRT);
    let numTokensBefore = await pool.getNumTokens.call();
    assert(isBoundBefore);
    await pool.unbind(DIRT);
    let isBoundAfter = await pool.isBound.call(DIRT);
    assert(!isBoundAfter);
    let numTokensAfter = await pool.getNumTokens.call();
    assert(numTokensAfter == numTokensBefore - 1);
  });

  it('unbind ERR_NOT_CONTROLLER ERR_NOT_BOUND ERR_IS_FUNDED', async () => {
      throw 'unimplemented';
  });

  it('rebind getBalance getWeight getSpotPrice', async () => {
      throw 'unimplemented';
  });

  it('rebind ERR_NOT_CONTROLLER ERR_NOT_BOUND ERR_IS_FINALIZED', async () => {
      throw 'unimplemented';
  });

  it('rebind ERR_MIN_WEIGHT ERR_MAX_WEIGHT ERR_MIN_BALANCE ERR_MAX_BALANCE', async () => {
      throw 'unimplemented';
  });

  it('rebind ERR_MAX_TOTAL_WEIGHT', async () => {
      throw 'unimplemented';
  });

  it('rebind ERR_BTOKEN_UNDERFLOW ERR_ERC20_FALSE', async () => {
      throw 'unimplemented';
  });

  it('setFees ERR_NOT_CONTROLLER ERR_MAX_FEE getFees', async () => {
      throw 'unimplemented';
  });

  it('setController getController ERR_NOT_CONTROLLER', async () => {
      throw 'unimplemented'
  });
});
