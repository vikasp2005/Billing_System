export const sendEmail = async (to, subject, text) => {
    // In a real application, you would use a service like Nodemailer or SendGrid
    console.log(`Sending email to ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${text}`)
}


