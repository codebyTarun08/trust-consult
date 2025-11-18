exports.sendReviewDoneClientEmail = (clientName, consultantName, bookingId, rating, review) => {
    
    // Define a success/positive color palette
    const primaryColor = '#2ecc71'; // Success Green
    const secondaryColor = '#34495e'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    // Helper to generate star rating display
    const starRating = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Thank You For Your Feedback</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden; text-align: center;">
          
          <div style="background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Feedback Received! Thank You! 🙌</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Hello ${clientName},
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 30px;">
              We've successfully received your review for the consultation with ${consultantName}. Your feedback is highly valuable to us and the TrustConsult community!
            </p>

            <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: ${secondaryColor}; font-weight: 600;">
                YOUR RATING
              </p>
              <h2 style="margin: 0 0 15px 0; font-size: 28px; color: ${primaryColor}; letter-spacing: 2px;">
                ${starRating}
              </h2>
              <blockquote style="margin: 0; font-style: italic; color: #777777; font-size: 15px; border-left: 3px solid #ccc; padding-left: 10px;">
                "${review}"
              </blockquote>
            </div>
            
            <p style="font-size: 14px; color: #777777; line-height: 1.5; margin-top: 30px;">
              Booking ID: ${bookingId}
            </p>

          </div>
          
          <div style="background-color: ${backgroundColor}; padding: 15px 30px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              – TrustConsult Team
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}

exports.sendReviewDoneConsultantEmail = (clientName, consultantName, bookingId, rating, review, profileLink) => {
    
    // Define a professional/notification color palette
    const primaryColor = '#3498db'; // Notification Blue
    const secondaryColor = '#2c3e50'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    // Helper to generate star rating display
    const starRating = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>You Received a New Review</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden; text-align: center;">
          
          <div style="background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🌟 New Client Review Received</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Hello ${consultantName},
            </p>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 30px;">
              ${clientName} has left a review for your consultation (Booking ID: ${bookingId}).
            </p>

            <div style="background-color: #ecf0f1; border: 1px solid ${primaryColor}; padding: 20px; margin: 25px 0; border-radius: 6px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: ${secondaryColor}; font-weight: 600;">
                RATING RECEIVED
              </p>
              <h2 style="margin: 0 0 15px 0; font-size: 28px; color: ${primaryColor}; letter-spacing: 2px;">
                ${starRating}
              </h2>
              <blockquote style="margin: 0; font-style: italic; color: #777777; font-size: 15px; border-left: 3px solid #ccc; padding-left: 10px;">
                "${review}"
              </blockquote>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${profileLink}" 
                 style="display: inline-block; padding: 12px 25px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);">
                View Full Review on Profile
              </a>
            </div>

          </div>
          
          <div style="background-color: ${backgroundColor}; padding: 15px 30px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 14px; color: ${secondaryColor}; font-weight: bold;">
              – TrustConsult Team
            </p>
          </div>
          
        </div>
      </body>
    </html>
`
}