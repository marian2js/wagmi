import type { Address } from 'abitype'
import { getAddress } from 'viem'
import { normalize } from 'viem/ens'

import { getProvider } from '../providers'

export type FetchEnsAddressArgs = {
  /** Chain id to use for provider */
  chainId?: number
  /** ENS name to resolve */
  name: string
}

export type FetchEnsAddressResult = Address | null

export async function fetchEnsAddress({
  chainId,
  name,
}: FetchEnsAddressArgs): Promise<FetchEnsAddressResult> {
  const provider = getProvider({ chainId })
  const address = await provider.getEnsAddress({
    name: normalize(name),
    // TODO(viem-migration): remove below once viem updates to new universal resolver contract.
    universalResolverAddress: '0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376',
  })

  try {
    if (address === '0x0000000000000000000000000000000000000000') return null
    return address ? getAddress(address) : null
  } catch (_error) {
    return null
  }
}
