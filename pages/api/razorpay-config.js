export default function handler(req, res) {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    '';

  if (!keyId) {
    return res.status(500).json({
      error: 'Missing Razorpay key id',
    });
  }

  return res.status(200).json({
    keyId,
  });
}
