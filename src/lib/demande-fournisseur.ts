// E-mail asking a supplier for missing invoices (retour de Simon et Julien). Nothing is sent by the app: the text
// opens in the client's own mail app (mailto:), so the supplier recognises its customer and the client checks it first.
import { formatDate, formatEUR, type Tx } from "@/lib/session";

export function demandeFournisseur(opts: {
  fournisseur: string;
  client: string;
  referenceClient: string;
  paiements: Tx[];
  adresseDossier?: string | null | undefined;
}) {
  const { fournisseur, client, referenceClient, paiements, adresseDossier } = opts;
  const n = paiements.length;
  const lignes = paiements
    .map((t) => `- paiement du ${formatDate(t.date)} : ${formatEUR(Math.abs(Number(t.amount)))}`)
    .join("\n");
  const subject = `Demande de facture${n > 1 ? "s" : ""}${client ? ` – ${client}` : ""}`;
  const body = [
    "Bonjour,",
    "",
    `Pourriez-vous s'il vous plaît nous transmettre ${n > 1 ? "les factures correspondant aux paiements suivants" : "la facture correspondant au paiement suivant"}, effectué${n > 1 ? "s" : ""} au profit de ${fournisseur} :`,
    lignes,
    ...(referenceClient.trim() ? ["", `Notre référence client : ${referenceClient.trim()}`] : []),
    "",
    adresseDossier
      ? `Vous pouvez nous les adresser en réponse à ce message, ou directement à notre adresse de réception des factures : ${adresseDossier}`
      : "Vous pouvez nous les adresser en réponse à ce message.",
    "",
    "Avec nos remerciements, bien cordialement,",
    client,
  ].join("\n");
  return { subject, body };
}

export function mailtoDemande(to: string, d: { subject: string; body: string }) {
  return `mailto:${encodeURIComponent(to.trim())}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
}
