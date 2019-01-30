const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

const INITIAL_STRING = 'Que onda morro!';
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts  to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ from: accounts[0], gas: '1000000' });
  
  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('Deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('Has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('Can change the message', async () => {
    await inbox.methods.setMessage('Al rato').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Al rato');
  });
});
