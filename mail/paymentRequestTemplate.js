exports.paymentRequestTemplate = (clientName,consultantName,amount,paymentLink) => {
    return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
        <h2 style="color:#2c3e50;">Payment Pending</h2>
        <p>Hello <strong>${clientName}</strong>,</p>
        <p>Your consultation with <strong>${consultantName}</strong> (Booking ID: <strong>${bookingId}</strong>) has been completed.</p>
        <p>Please complete your payment of <strong>₹${amount}</strong> to finalize the session.</p>
        <p><a href="${paymentLink}" style="background:#3498db; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px;">Pay Now</a></p>
        <p>If payment is not completed, you will receive reminders every 2 days.</p>
        <br>
        <p> TrustConsult Team</p>
      </div>
    </body>
  </html>
`}