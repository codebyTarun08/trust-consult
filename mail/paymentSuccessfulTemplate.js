exports.paymentSuccessfulClientTemplate = (clientName, consultantName, bookingId, amount) => {
    
    // Define a success-focused color palette
    const successColor = '#2ecc71'; // Bright Green for success
    const primaryColor = '#27ae60'; // Darker Green for accents
    const secondaryColor = '#34495e'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Payment Successful - Thank You!</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden; text-align: center;">
          
          <div style="background-color: ${successColor}; padding: 25px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Payment Successful! 🎉</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Hello ${clientName},
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 30px;">
              Thank you for your prompt payment! Your transaction for the consultation with ${consultantName} has been successfully processed.
            </p>

            <div style="background-color: #e8f8f5; border: 1px solid ${primaryColor}; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: 600;">
                PAYMENT SUMMARY
              </p>
              <h2 style="margin: 10px 0 0 0; font-size: 32px; color: ${primaryColor}; font-weight: 800;">
                ₹${amount}
              </h2>
            </div>
           
            <ul style="list-style-type: none; padding: 0; margin: 20px 0;">
              <li style="margin-bottom: 8px;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Booking ID:</strong> 
                <span style="font-weight: 600; float: right;">${bookingId}</span>
              </li>

              <li style="padding-top: 8px;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Consultant:</strong> 
                <span style="font-weight: 600; float: right;">${consultantName}</span>
              </li>
            </ul>


            
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              – TrustConsult Team
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}

exports.paymentSuccessfulConsultantTemplate = (clientName, consultantName, bookingId, amount) => {
    
    // Define a professional and revenue-focused color palette
    const successColor = '#2ecc71'; // Bright Green for success
    const primaryColor = '#27ae60'; // Darker Green (Revenue focus)
    const secondaryColor = '#34495e'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Client Payment Received</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden; text-align: center;">
          
          <div style="background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Payment Received! 💰</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Hello **${consultantName}**,
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 30px;">
              Great news! The payment for your recent consultation has been successfully processed by the client.
            </p>

            <div style="background-color: #e8f8f5; border: 1px solid ${primaryColor}; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: 600;">
                TOTAL CLIENT PAYMENT
              </p>
              <h2 style="margin: 10px 0 0 0; font-size: 32px; color: ${primaryColor}; font-weight: 800;">
                ₹${amount}
              </h2>
            </div>
            
            <ul style="list-style-type: none; padding: 0; margin: 20px 0;">
              <li style="margin-bottom: 8px;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Client Name:</strong> 
                <span style="font-weight: 600; float: right;">${clientName}</span>
              </li>
              <li style="margin-bottom: 8px; border-bottom: 1px dashed #eeeeee; padding-bottom: 8px;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Booking ID:</strong> 
                <span style="font-weight: 600; float: right;">${bookingId}</span>
              </li>
              <li style="padding-top: 8px;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Your Earnings:</strong> 
                <span style="color: #e67e22; font-weight: 700; float: right;">(See Dashboard for Net Payout)</span>
              </li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="/dashboard" 
                 style="display: inline-block; padding: 12px 25px; background-color: ${secondaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                View Earnings Dashboard
              </a>
            </div>
            
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              – TrustConsult Team
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}

            //   <li style="margin-bottom: 8px; border-bottom: 1px dashed #eeeeee; padding-bottom: 8px;">
            //     <strong style="color: ${secondaryColor}; display: inline-block; width: 150px; text-align: left;">Transaction ID:</strong> 
            //     <span style="font-weight: 600; float: right;">${transactionId}</span>
            //   </li>

            // <div style="text-align: center; margin: 30px 0;">
            //   <a href="${invoiceLink}" 
            //      style="display: inline-block; padding: 12px 25px; background-color: ${secondaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            //     Download Invoice (PDF)
            //   </a>
            // </div>