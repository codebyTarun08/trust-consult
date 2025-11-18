exports.bookingCreatedClientTemplate = (bookingDetails) => {
  const { consultantName, clientName, date, startHour, endHour, rate, problemDescription } = bookingDetails;
    // Define main colors for easier maintenance
    const primaryColor = '#3498db'; // Blue for emphasis
    const secondaryColor = '#2c3e50'; // Dark text
    const accentColor = '#2ecc71'; // Green for price/success

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <div style="background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Booking Confirmed! 🎉</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: ${secondaryColor}; font-size: 20px; margin-top: 0; margin-bottom: 20px;">
              Hello ${clientName},
            </h2>
            <p style="color: #555555; line-height: 1.6;">
              We're excited! Your consultation slot has been successfully booked with <strong>${consultantName}</strong>.
            </p>

            <div style="background-color: #ecf0f1; border-left: 5px solid ${primaryColor}; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: ${secondaryColor}; font-weight: bold;">
                <span style="color: #888888;">When:</span> ${date}
              </p>
              <p style="margin: 0; font-size: 18px; color: ${secondaryColor}; font-weight: bold;">
                <span style="color: #888888;">Time:</span> ${startHour} – ${endHour}
              </p>
            </div>
            
            <h3 style="color: ${secondaryColor}; font-size: 16px; margin-top: 30px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">
              Booking Details
            </h3>
            <ul style="list-style-type: none; padding: 0; margin: 15px 0;">
              <li style="margin-bottom: 10px;">
                <strong>Rate:</strong> 
                <span style="color: ${accentColor}; font-weight: bold; font-size: 16px;">₹${rate}</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Consultant:</strong> ${consultantName}
              </li>
              <li>
                <strong>Description:</strong> ${problemDescription}
              </li>
            </ul>

            <p style="color: #555555; line-height: 1.6; margin-top: 30px;">
              Please be sure to attend your slot on time by navigating to your booking page.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="[LINK_TO_BOOKING_PAGE]" style="display: inline-block; padding: 12px 25px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Go to My Booking
              </a>
            </div>
            
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888888;">
              Thank you for trusting us.
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



exports.bookingCreatedConsultantTemplate = (bookingDetails) => {
  const { consultantName, clientName, date, startHour, endHour, rate, problemDescription, category } = bookingDetails;
    
  // Define a strong, professional color palette
  const primaryColor = '#2980b9'; // Professional Blue
  const secondaryColor = '#34495e'; // Dark Text/Accent
  const backgroundColor = '#f4f7f6'; // Light Background
  const cardShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Booking Request</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden;">
          
          <div style="background-color: ${secondaryColor}; padding: 15px 30px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700;">🚨 NEW BOOKING REQUEST!</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px;">
              Hello <strong>${consultantName}</strong>,
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 25px;">
              A new consultation request has been submitted by <strong>${clientName}</strong>. Please review the details below and take action on your dashboard.
            </p>

            <div style="border: 1px solid #e0e0e0; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <h3 style="color: ${primaryColor}; font-size: 18px; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #eeeeee; padding-bottom: 5px;">
                Request Summary
              </h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px; padding: 5px 0;">
                  <strong style="color: ${secondaryColor}; display: inline-block; width: 120px;">Client Name:</strong> 
                  <span style="font-weight: 600;">${clientName}</span>
                </li>
                <li style="margin-bottom: 12px; padding: 5px 0;">
                  <strong style="color: ${secondaryColor}; display: inline-block; width: 120px;">Date & Time:</strong> 
                  <span style="color: ${primaryColor}; font-weight: 700;">${date} (${startHour} - ${endHour})</span>
                </li>
                <li style="margin-bottom: 12px; padding: 5px 0;">
                  <strong style="color: ${secondaryColor}; display: inline-block; width: 120px;">Rate:</strong> 
                  <span style="font-weight: 600;">₹${rate}</span>
                </li>
              </ul>
            </div>
            
            <h3 style="color: ${secondaryColor}; font-size: 16px; margin-top: 30px; margin-bottom: 10px;">
              Client's Query Description:
            </h3>
            <blockquote style="border-left: 4px solid ${primaryColor}; padding: 10px 15px; margin: 0 0 30px 0; background-color: #f9f9f9; color: #555555; font-style: italic;">
              "${problemDescription}"
            </blockquote>

            <div style="text-align: center; margin: 30px 0;">
              <a href="/dashboard/appointments" style="display: inline-block; padding: 15px 30px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                Review & Take Action Now
              </a>
            </div>

            <p style="color: #777777; font-size: 14px; text-align: center; margin-top: 20px;">
              You must confirm or decline this booking on your dashboard within 24 hours.
            </p>
            
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888888;">
              This is a notification requiring your approval.
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