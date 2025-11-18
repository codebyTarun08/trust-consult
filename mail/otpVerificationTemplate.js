exports.otpVerificationTemplate = (otp) => {
    
    // Define a security-focused color palette
    const primaryColor = '#3498db'; // Professional Blue
    const secondaryColor = '#2c3e50'; // Dark text
    const backgroundColor = '#f4f7f6'; // Light Background
    const cardShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>One-Time Password (OTP)</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; margin: 0; padding: 0;">
        <div style="max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: ${cardShadow}; overflow: hidden; text-align: center;">
          
          <div style="background-color: ${primaryColor}; padding: 20px 30px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">🔐 Account Verification Code</h1>
          </div>

          <div style="padding: 30px;">
            <p style="color: ${secondaryColor}; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Please use the following One-Time Password (OTP) to complete your verification or login process.
            </p>

            <div style="background-color: #ecf0f1; border: 2px dashed ${primaryColor}; padding: 15px 10px; margin: 25px auto; border-radius: 4px; max-width: 250px;">
              <h2 style="color: ${secondaryColor}; font-size: 36px; margin: 0; letter-spacing: 5px; font-weight: 700;">
                ${otp}
              </h2>
            </div>
            
            <p style="font-size: 14px; color: ${primaryColor}; font-weight: bold; margin-bottom: 5px;">
              This code is valid for 5 minutes.
            </p>
            <p style="font-size: 14px; color: #777777; line-height: 1.5;">
              For security reasons, do not share this code with anyone. If you did not request this OTP, please ignore this email.
            </p>
            
          </div>
          
          <div style="background-color: #f4f7f6; padding: 15px 30px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888888;">
              If you have issues, contact support.
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