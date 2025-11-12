const VERIFICATION_KEY = "im_human_verification";
const ADDRESS_BINDING_KEY = "im_human_address_binding";

export interface VerificationData {
  userId: string;
  proofs: any[];
  timestamp: number;
  verified: boolean;
}

export interface AddressBinding {
  address: string;
  userId: string;
  timestamp: number;
  bound: boolean;
  signature?: string;
  message?: string;
}

// Verification storage functions
export const saveVerification = (userId: string, proofs: any[]) => {
  const data: VerificationData = {
    userId,
    proofs,
    timestamp: Date.now(),
    verified: true,
  };
  localStorage.setItem(VERIFICATION_KEY, JSON.stringify(data));
};

export const getVerification = (): VerificationData | null => {
  const data = localStorage.getItem(VERIFICATION_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    // Check if verification is still valid (within 5 minutes)
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isValid = Date.now() - parsed.timestamp < FIVE_MINUTES;

    if (!isValid) {
      // Auto-clear expired data
      localStorage.removeItem(VERIFICATION_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const clearVerification = () => {
  localStorage.removeItem(VERIFICATION_KEY);
};

// Address binding functions
export const bindAddress = (
  address: string,
  userId: string,
  signature?: string,
  message?: string
) => {
  const data: AddressBinding = {
    address,
    userId,
    timestamp: Date.now(),
    bound: true,
    signature,
    message,
  };
  localStorage.setItem(ADDRESS_BINDING_KEY, JSON.stringify(data));
};

export const getAddressBinding = (address: string): AddressBinding | null => {
  const data = localStorage.getItem(ADDRESS_BINDING_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);

    // Check if binding is still valid (within 5 minutes)
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isValid = Date.now() - parsed.timestamp < FIVE_MINUTES;

    if (!isValid) {
      // Auto-clear expired data
      localStorage.removeItem(ADDRESS_BINDING_KEY);
      return null;
    }

    // Check if the address matches
    return parsed.address === address ? parsed : null;
  } catch {
    return null;
  }
};

export const isAddressBound = (address: string): boolean => {
  const binding = getAddressBinding(address);
  return binding !== null && binding.bound;
};

export const clearAddressBinding = () => {
  localStorage.removeItem(ADDRESS_BINDING_KEY);
};

export const clearAll = () => {
  clearVerification();
  clearAddressBinding();
};
