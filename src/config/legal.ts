const publisherName =
  import.meta.env.VITE_LEGAL_PUBLISHER_NAME?.trim() ?? "";
const publisherStatus =
  import.meta.env.VITE_LEGAL_PUBLISHER_STATUS?.trim() ?? "";
const publisherAddress =
  import.meta.env.VITE_LEGAL_PUBLISHER_ADDRESS?.trim() ?? "";
const contactEmail =
  import.meta.env.VITE_LEGAL_CONTACT_EMAIL?.trim() ?? "";
const contactPhone =
  import.meta.env.VITE_LEGAL_CONTACT_PHONE?.trim() ?? "";
const publicationDirector =
  import.meta.env.VITE_LEGAL_PUBLICATION_DIRECTOR?.trim() ?? "";
const registrationNumber =
  import.meta.env.VITE_LEGAL_REGISTRATION_NUMBER?.trim() ?? "";
const vatNumber =
  import.meta.env.VITE_LEGAL_VAT_NUMBER?.trim() ?? "";

export const legalConfig = {
  publisherName,
  publisherStatus,
  publisherAddress,
  contactEmail,
  contactPhone,
  publicationDirector,
  registrationNumber,
  vatNumber,
  repositoryUrl: "https://github.com/Rakos27/dealyva",
  isPublisherIdentityComplete: Boolean(
    publisherName &&
      publisherStatus &&
      publisherAddress &&
      contactEmail &&
      publicationDirector,
  ),
};

export const legalLastUpdated = "29 juillet 2026";
