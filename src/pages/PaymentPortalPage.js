import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { receiveCheckoutFromQueue, confirmPayment } from "../services/checkout";

const PaymentPortalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [receiptHandle, setReceiptHandle] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Get sessionId from URL state
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    loadCheckoutData();
  }, [sessionId]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve checkout data from queue
      const result = await receiveCheckoutFromQueue(sessionId);

      if (!result.success) {
        throw new Error(result.message || "Failed to load checkout data");
      }

      setCheckoutData(result.checkoutData);
      setReceiptHandle(result.receiptHandle);
    } catch (err) {
      console.error("Error loading checkout data:", err);
      setError(err.message || "Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Confirm payment and save order
      const result = await confirmPayment({
        receiptHandle,
        checkoutData,
        paymentMethod,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to confirm payment");
      }

      setOrderId(result.orderId);
      setPaymentComplete(true);

      // Redirect back to main site after 3 seconds
      setTimeout(() => {
        navigate("/account/orders", {
          state: { orderConfirmed: true, orderId: result.orderId },
        });
      }, 3000);
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(err.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-indigo-600 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Payment Portal...
            </h2>
            <p className="text-gray-600 mt-2">
              Retrieving your order information
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Payment
            </h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <button
              onClick={() => navigate("/account/cart")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Your order has been confirmed
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-semibold text-gray-900">{orderId}</p>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Redirecting you back to the website...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center justify-center mb-2">
            <Lock size={24} className="mr-2" />
            <h1 className="text-2xl font-bold">Secure Payment Portal</h1>
          </div>
          <p className="text-indigo-100 text-center text-sm">
            Complete your payment to finalize your order
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-3">
                  {checkoutData?.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}, Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${checkoutData?.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              {checkoutData?.userInfo?.name && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Billing Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    {checkoutData.userInfo.name}
                  </p>
                  {checkoutData.userInfo.email && (
                    <p className="text-sm text-gray-600">
                      {checkoutData.userInfo.email}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Details
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard size={20} className="mr-2 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              {/* Mock Card Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={processing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={processing}
                    />
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} className="mr-2" />
                    Confirm Payment ${checkoutData?.total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                This is a simulated payment portal. No actual charges will be
                made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortalPage;
