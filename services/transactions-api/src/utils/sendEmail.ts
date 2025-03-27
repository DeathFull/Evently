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
