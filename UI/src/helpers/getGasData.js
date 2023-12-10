import axios from 'axios'
import { Buffer } from 'buffer'

export const fetchGasData = async () => {
  try {
    // Set up the Authorization header
    // eslint-disable-next-line no-undef
    const Auth = Buffer.from(
      '64a4d5b032e348e0828a7375543cae94' +
        ':' +
        '/rj76eTLHJNuDJyL4FeUlJjZhjZm3hoB4WDEjee50ywio/c5gYVSFw'
    ).toString('base64')

    // The chain ID of the supported network
    const chainId = 1

    const { data } = await axios.get(
      `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      }
    )

    return data
  } catch (error) {
    console.log('Server responded with:', error)
  }
}
