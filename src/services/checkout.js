// src/services/checkout.js
// Service for interacting with the checkout queue API

const API_BASE_URL = process.env.REACT_APP_CHECKOUT_API_URL;

/**
 * Send checkout data to SQS queue
 * @param {Object} checkoutData - The checkout data
 * @param {Array} checkoutData.cartItems - Cart items
 * @param {number} checkoutData.total - Total amount
 * @param {Object} checkoutData.userInfo - User information
 * @param {string} checkoutData.sessionId - Session ID
 * @returns {Promise<Object>} - Response with messageId and sessionId
 */
export const sendCheckoutToQueue = async (checkoutData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send checkout data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending checkout to queue:", error);
    throw error;
  }
};

/**
 * Receive checkout data from SQS queue
 * @param {string} sessionId - Optional session ID to filter messages
 * @returns {Promise<Object>} - Checkout data with receipt handle
 */
export const receiveCheckoutFromQueue = async (sessionId) => {
  try {
    const url = sessionId
      ? `${API_BASE_URL}/checkout/receive?sessionId=${encodeURIComponent(sessionId)}`
      : `${API_BASE_URL}/checkout/receive`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to receive checkout data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error receiving checkout from queue:", error);
    throw error;
  }
};

/**
 * Confirm payment and save order to database
 * @param {Object} paymentData - Payment confirmation data
 * @param {string} paymentData.receiptHandle - SQS receipt handle
 * @param {Object} paymentData.checkoutData - Original checkout data
 * @param {string} paymentData.paymentMethod - Payment method used
 * @returns {Promise<Object>} - Order confirmation with orderId
 */
export const confirmPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to confirm payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};
