import Web3 from 'web3'

const web3 = new Web3(
  'https://velvet-bnb.rpc.blxrbdn.com' ||
    'https://binance.llamarpc.com' ||
    'https://drpc.org/public-endpoints/bsc' ||
    Web3.givenProvider
)

export const getBalance = async (account) => {
  try {
    let balance = await web3.eth.getBalance(account)
    balance = web3.utils.fromWei(balance, 'ether')
    return balance
  } catch (e) {
    console.log(e, 'error')
  }
}
