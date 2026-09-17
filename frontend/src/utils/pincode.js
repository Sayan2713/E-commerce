/**
 * Looks up city/state for an Indian PIN code using India Post's free public
 * API (no key required). Returns null on any failure (unknown pincode,
 * network error, rate limit) so callers can fall back to manual entry
 * without breaking checkout.
 */
export async function lookupPincode(pincode) {
  if (!/^\d{6}$/.test(pincode)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    const postOffice = data?.[0]?.PostOffice?.[0];
    if (!postOffice) return null;
    return { city: postOffice.District, state: postOffice.State, postOffice: postOffice.Name };
  } catch {
    return null;
  }
}
