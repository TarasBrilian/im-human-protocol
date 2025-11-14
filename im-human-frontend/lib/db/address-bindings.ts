import { prisma } from '../prisma'
import { getOrCreateUser } from './users'

/**
 * Save address binding with signature
 */
export async function saveAddressBinding(
  address: string,
  userId: string,
  signature?: string,
  message?: string
) {
  // Ensure user exists
  await getOrCreateUser(address)

  return await prisma.addressBinding.upsert({
    where: {
      address_userId: {
        address,
        userId,
      },
    },
    update: {
      signature,
      message,
      timestamp: new Date(),
    },
    create: {
      address,
      userId,
      signature,
      message,
      bound: true,
    },
  })
}

/**
 * Get address binding
 */
export async function getAddressBinding(address: string, userId: string) {
  return await prisma.addressBinding.findUnique({
    where: {
      address_userId: {
        address,
        userId,
      },
    },
  })
}

/**
 * Check if address is bound
 */
export async function isAddressBound(address: string, userId: string): Promise<boolean> {
  const binding = await getAddressBinding(address, userId)
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
