import emailjs from '@emailjs/browser';
export function sendEmail(email : string, verify_link: string) {
    var templateParams = {
        user_email: email,
        email_verification_link: verify_link
    };
    emailjs.send('service_gnj8bnr', 'template_amw236t', templateParams, 'p43nS_e7Yrs-Ja6G_')
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
}
