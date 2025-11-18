exports.bookingCompletedTemplate = (clientName, consultantName) => {
    
    // Define a professional and action-oriented color palette
    const primaryColor = '#2ecc71'; // Success Green
    const paymentColor = '#e67e22'; // Orange/Amber for Payment action
    const reviewColor = '#3498db';  // Blue for Review action
    const secondaryColor = '#34495e'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Consultation Completed & Next Steps</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden;">
          
          <div style="background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Session Successful! 🎉</h1>
          </div>

          <div style="padding: 30px; text-align: center;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px;">
              Hello ${clientName},
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 30px;">
              Your consultation with ${consultantName} has been marked as Completed. We hope the session was valuable!
            </p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <h3 style="color: ${secondaryColor}; font-size: 18px; margin-top: 0; margin-bottom: 20px;">
                Your Next Steps
              </h3>
              
              <div style="margin: 10px 0;">
                
                <a href="/bookings" 
                   style="display: inline-block; padding: 12px 25px; background-color: ${paymentColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin: 10px; min-width: 200px; box-shadow: 0 4px 8px rgba(230, 126, 34, 0.4);">
                  💳 Complete Payment
                </a>
                
                <a href="/bookings" 
                   style="display: inline-block; padding: 12px 25px; background-color: ${reviewColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin: 10px; min-width: 200px; box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);">
                  ⭐ Leave Review
                </a>
              </div>
              
              <p style="margin-top: 25px; font-size: 14px; color: #777777;">
                Your prompt action on these items is greatly appreciated.
              </p>
            </div>
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              Thank you for using TrustConsult!
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}