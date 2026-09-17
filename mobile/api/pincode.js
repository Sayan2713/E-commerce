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
