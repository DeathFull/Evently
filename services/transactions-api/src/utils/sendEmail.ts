export default function sendMail({
  user,
  event,
}: {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  event: {
    name: string;
    location: string;
    date: Date;
    type: "CONCERT" | "SPECTACLE" | "FESTIVAL";
  };
}) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailContent = `
    De: noreply@evenement.com
    À: ${user.email}
    Objet: Confirmation de réservation - ${event.name}

    Bonjour ${user.firstName} ${user.lastName},

    Nous confirmons votre réservation pour l'événement suivant :

    📅 Événement: ${event.name}
    📍 Lieu: ${event.location}
    🗓 Date: ${formattedDate}
    🎭 Type: ${event.type}

    Merci de votre confiance et à bientôt !

    Cordialement,
    L'équipe Evently
  `;

  console.log("Sending email...");
  console.log(emailContent);
}
/**
 * Utility function to send email notifications for transactions
 * This is a mock implementation - in a real application, you would
 * integrate with an email service like SendGrid, Mailgun, etc.
 */

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface Event {
  name: string;
  location: string;
  date: Date;
  type: "CONCERT" | "SPECTACLE" | "FESTIVAL";
}

export default function sendEmail({ 
  user, 
  event 
}: { 
  user: User; 
  event: Event;
}): void {
  // In a real implementation, this would send an actual email
  console.log(`
    ✉️ Sending email to: ${user.email}
    Subject: Your ticket for ${event.name}
    
    Dear ${user.firstName} ${user.lastName},
    
    Thank you for your purchase! Your ticket for ${event.name} has been confirmed.
    
    Event Details:
    - Name: ${event.name}
    - Type: ${event.type}
    - Date: ${new Date(event.date).toLocaleDateString()}
    - Location: ${event.location}
    
    Please arrive 30 minutes before the event starts.
    
    Regards,
    The Evently Team
  `);
}
