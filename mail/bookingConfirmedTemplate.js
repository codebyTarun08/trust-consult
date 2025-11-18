exports.bookingConfirmedTemplate = (clientName , bookingId, consultantName, date, startHour, endHour) => {
    // Note: I added startHour and endHour to the parameters, as 'date' usually isn't enough for a professional confirmation.
    
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
        <title>Booking Confirmed!</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden;">
          
          <div style="background-color: ${successColor}; padding: 25px 30px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">CONFIRMED! Your Session is Set ✅</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px;">
              Hello ${clientName},
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 25px;">
              We're pleased to confirm your consultation with ${consultantName}. All the details you need are listed below.
            </p>

            <div style="background-color: #e8f8f5; border: 1px solid ${primaryColor}; padding: 20px; margin: 25px 0; border-radius: 6px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: ${primaryColor}; font-weight: 600;">
                CONSULTATION DETAILS
              </p>
              <p style="margin: 10px 0 5px 0; font-size: 18px; color: ${secondaryColor}; font-weight: 600;">
                <strong style="color: ${primaryColor};">Date :</strong> ${date}
              </p>
              <p style="margin: 0; font-size: 18px; color: #555555; font-weight: 600;">
                <strong style="color: ${primaryColor};">Time :</strong> ${startHour} – ${endHour}
              </p>
            </div>
            
            <ul style="list-style-type: none; padding: 0; margin: 20px 0;">
              <li style="margin-bottom: 12px; padding: 5px 0; border-bottom: 1px dashed #eeeeee;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 140px;">Consultant:</strong> 
                <span style="font-weight: 600;">${consultantName}</span>
              </li>
              <li style="padding: 5px 0;">
                <strong style="color: ${secondaryColor}; display: inline-block; width: 140px;">Location/Link:</strong> 
                <span style="color: #e74c3c; font-weight: 700;">https://localhost:3000/chat/${bookingId}</span>
              </li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="/chat/${bookingId}" style="display: inline-block; padding: 15px 30px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 8px rgba(39, 174, 96, 0.4);">
                Join Your Session
              </a>
            </div>
            
            <p style="color: #777777; font-size: 14px; text-align: center; margin-top: 20px;">
              Please add this event to your calendar to avoid missing the time slot.
            </p>
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888888;">
              We look forward to connecting you!
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