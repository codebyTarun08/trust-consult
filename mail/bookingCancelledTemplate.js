exports.bookingCancelledTemplate = (clientName, consultantName, date, startHour, endHour, reason) => {
    const warningColor = '#e74c3c'; // Red for cancellation
    const secondaryColor = '#34495e'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Booking Cancelled</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden;">
          
          <div style="background-color: ${warningColor}; padding: 25px 30px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Booking Cancelled 🚫</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px;">
              Hello <strong>${clientName}</strong>,
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 25px;">
              We regret to inform you that your consultation with <strong>${consultantName}</strong> has been <strong>cancelled</strong>.
            </p>

            <div style="background-color: #fce8e8; border: 1px solid ${warningColor}; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <h3 style="color: ${warningColor}; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
                CANCELLATION REASON
              </h3>
              <p style="margin: 0 0 15px 0; font-size: 16px; color: ${secondaryColor}; font-weight: 600;">
                <strong>Reason:</strong> ${reason || 'N/A'}
              </p>
              <p style="margin: 0; font-size: 14px; color: #777777;">
                The appointment for <strong>${date}</strong> at <strong>${startHour} – ${endHour}</strong> has been removed from your schedule.
              </p>
            </div>
            
            <h3 style="color: ${secondaryColor}; font-size: 16px; margin-top: 30px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
              What should you do now?
            </h3>
            <ol style="color: #555555; line-height: 1.8; padding-left: 20px;">
              <li>We encourage you to <strong>rebook</strong> with the same consultant or explore other available experts.</li>
              <li>For any payment queries, please contact our support team.</li>
            </ol>

            <div style="text-align: center; margin: 30px 0;">
              <a href="[LINK_TO_REBOOKING_PAGE]" style="display: inline-block; padding: 15px 30px; background-color: ${secondaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                Find a New Slot
              </a>
            </div>
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888888;">
              We apologize for the inconvenience.
            </p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              – TrustConsult Team
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}