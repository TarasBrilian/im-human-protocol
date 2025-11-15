import { prisma } from '../prisma'
import { getOrCreateUser } from './users'

/**
 * Save address binding with signature
 */
export async function saveAddressBinding(
  address: string,
  cexType: string,
  userId: string,
  signature?: string,
  message?: string
) {
  // Ensure user exists
  await getOrCreateUser(address)

  return await prisma.addressBinding.upsert({
    where: {
      address_cexType: {
        address,
        cexType,
      },
    },
    update: {
      signature,
      message,
      timestamp: new Date(),
    },
    create: {
      address,
      cexType,
      userId,
      signature,
      message,
      bound: true,
    },
  })
}

/**
 * Get address binding for specific CEX
 */
export async function getAddressBinding(address: string, cexType: string) {
  return await prisma.addressBinding.findUnique({
    where: {
      address_cexType: {
        address,
        cexType,
      },
    },
  })
}

/**
 * Check if address is bound to specific CEX
 */
export async function isAddressBound(address: string, cexType: string): Promise<boolean> {
  const binding = await getAddressBinding(address, cexType)
  return binding !== null && binding.bound
}

/**
 * Get all bindings for an address
 */
export async function getAllAddressBindings(address: string) {
  return await prisma.addressBinding.findMany({
    where: { address },
    orderBy: { timestamp: 'desc' },
  })
}
