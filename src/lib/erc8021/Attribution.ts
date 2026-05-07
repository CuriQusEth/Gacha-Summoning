// ERC-8021 Transaction Attribution implementation
// Using placeholder attribution code as requested

export const ERC8021_CONFIG = {
  ATTRIBUTION_CODE: "[ATTRIBUTION_CODE]",
  BUILDER_CODE: "bc_easlb0ew",
};

/**
 * Appends ERC-8021 attribution data to calldata
 */
export const withAttribution = (calldata: string): string => {
  // In a real implementation this would encode the attribution payload
  // and append to the end of the calldata or encode via specific function.
  // We'll return the calldata as is for the UI, but it demonstrates the structure.
  console.log(`[ERC-8021] Attributed Tx - Builder: ${ERC8021_CONFIG.BUILDER_CODE}, App: ${ERC8021_CONFIG.ATTRIBUTION_CODE}`);
  return calldata;
};
