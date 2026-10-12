/**
 * Currency utilities for Ruwan Car Rentals
 * Display prices in Sri Lankan Rupees (LKR / Rs.)
 * Conversion rate: ~$1 USD ~ 300 LKR
 */
export const LKR_CONVERSION_RATE = 300;

/**
 * Format a numeric amount into Sri Lankan Rupees (LKR)
 * Example: 65 -> "Rs. 19,500" or "LKR 19,500"
 */
export function formatLKR(amountInUSDorBase: number, options?: { showCode?: boolean }): string {
  const lkrAmount = Math.round(amountInUSDorBase * LKR_CONVERSION_RATE);
  const formatted = lkrAmount.toLocaleString('en-LK');
  return options?.showCode ? `LKR ${formatted}` : `Rs. ${formatted}`;
}

/**
 * Format raw LKR directly (when amount is already in LKR)
 */
export function formatRawLKR(amount: number, options?: { showCode?: boolean }): string {
  const formatted = Math.round(amount).toLocaleString('en-LK');
  return options?.showCode ? `LKR ${formatted}` : `Rs. ${formatted}`;
}

/**
 * Get a vehicle's specific extra hour charge in Sri Lankan Rupees (LKR)
 * Defaults sensibly based on daily rate if not explicitly configured.
 */
export function getVehicleExtraHourRate(vehicle: { dailyRate?: number; extraHourRate?: number } | null | undefined): number {
  if (!vehicle) return 1500;
  if (typeof vehicle.extraHourRate === 'number' && vehicle.extraHourRate > 0) {
    return vehicle.extraHourRate < 100
      ? Math.round(vehicle.extraHourRate * LKR_CONVERSION_RATE)
      : Math.round(vehicle.extraHourRate);
  }
  const baseLkr = (vehicle.dailyRate || 80) * LKR_CONVERSION_RATE;
  return Math.max(750, Math.round((baseLkr / 10) / 50) * 50);
}

/**
 * Format the extra hour rate with time suffix (e.g. "Rs. 1,500/hr")
 */
export function formatExtraHourRate(rateInLKR: number, options?: { showCode?: boolean }): string {
  return `${formatRawLKR(rateInLKR, options)}/hr`;
}

/**
 * Calculate extra hour late return cost:
 * Formula: Extra Hour Charges * Number of Chargeable Extra Hours
 */
export function calculateLateReturnCost(extraHourRateInLKR: number, chargeableHours: number): number {
  if (chargeableHours <= 0) return 0;
  return Math.round(extraHourRateInLKR * chargeableHours);
}
