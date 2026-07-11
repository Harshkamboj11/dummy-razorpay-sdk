const Razorpay = require('razorpay');
const shortid = require('shortid');

function getRazorpayKeyId() {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    ''
  );
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Initialize razorpay object
    const razorpay = new Razorpay({
      key_id: getRazorpayKeyId(),
      key_secret: process.env.RAZORPAY_SECRET,
    });

    if (!getRazorpayKeyId() || !process.env.RAZORPAY_SECRET) {
      return res.status(500).json({
        error:
          'Missing Razorpay env vars. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in Vercel.',
      });
    }

    const payment_capture = 1;
    const amount = req.body.amount || 499;
    const currency = req.body.currency || 'INR';
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    // Handle any other HTTP method
  }
}
