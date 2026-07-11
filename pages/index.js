import Head from 'next/head';
import Image from 'next/image';
import { Element } from '../components/Element';
import { Navbar } from '../components/Navbar';
import styles from '../styles/Home.module.css';

import { useState } from 'react';

export default function Home() {
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

  const [form, setForm] = useState({
    amount: '499',
    orderId: '',
    name: 'Manu Arora',
    email: 'manuarorawork@gmail.com',
    contact: '9999999999',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const makePayment = async (e, manualOrderId = null) => {
    e.preventDefault();

    if (!razorpayKey) {
      alert(
        'Missing NEXT_PUBLIC_RAZORPAY_KEY. Set it in Vercel, then redeploy this site.'
      );
      return;
    }

    const res = await initializeRazorpay();

    if (!res) {
      alert('Razorpay SDK Failed to load');
      return;
    }

    let data = {
      id: manualOrderId || form.orderId,
      currency: 'INR',
      amount: parseInt(form.amount) * 100,
    };

    if (!data.id) {
      // Make API call to the serverless API to create order if no ID provided
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: form.amount }),
      }).then((t) => t.json());

      if (response.id) {
        data = response;
      } else {
        alert('Failed to create order');
        console.error(response);
        return;
      }
    }

    console.log('Payment Data:', data);

    var options = {
      key: razorpayKey,
      name: 'Razorpay Test Mediator',
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: 'Testing Razorpay Implementation',
      image: 'https://manuarora.in/logo.png',
      handler: function (response) {
        alert(
          'Payment Successful!\nPayment ID: ' + response.razorpay_payment_id
        );
        console.log(response);
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.contact,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white font-sans selection:bg-indigo-500/30">
      <Head>
        <title>Razorpay Test Mediator ⚡</title>
        <meta
          name="description"
          content="Test your Razorpay backend implementation easily."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Razorpay <span className="text-indigo-500">Mediator</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Test your backend API or manually trigger payments using existing
            Order IDs.
          </p>
        </div>

        <div className="bg-[#1F2937] border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Amount (INR)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. 499"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                  className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition font-mono text-sm"
                  placeholder="order_PHXXXXXXX"
                />
              </div>
            </div>

            <hr className="border-gray-700" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={(e) => makePayment(e)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
              >
                {form.orderId ? 'Pay with Order ID' : 'Create Order & Pay'}
              </button>
            </div>

            {!form.orderId && (
              <p className="text-center text-xs text-gray-500 italic">
                * This will call your /api/razorpay backend to generate a new
                Order ID.
              </p>
            )}
          </form>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Created for testing purposes. Do not use real credentials.</p>
        </div>
      </main>
    </div>
  );
}
