import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import coopFactoryABI from '../abi/coopfactory.json'
import blockcoopABI from '../abi/blockcoop.json'
import balanceABI from '../abi/balance.json'
import parentABI from '../abi/parent.json'
import childABI from '../abi/child.json'

export function useBlockcoopContract(coopAddress) {
    return useContract({
        abi: blockcoopABI as Abi,
        address: coopAddress
    })
}

export function useCoopFactoryContract() {
    return useContract({
        abi: coopFactoryABI as Abi,
        address: '0x034ed1ba295b32b4d104972b2b40616005f3d6baaad5ffaf1ccf62d5dbade0b8'
    })
}

export function useBalanceContract() {
    return useContract({
        abi: balanceABI as Abi,
        address: '0x02b009b31adc59ecd095d7453417610601082229dda81695c435db8b5f988375'
    })
}

export function useParentContract() {
    return useContract({
        abi: parentABI as Abi,
        address: '0x04a55157202793a18ab3149680c6d6956e472c2dc9bea7f2688cca04c06fc0d9'
    })
}

export function useChildContract(childAddress) {
    return useContract({
        abi: childABI as Abi,
        address: childAddress
    })
}