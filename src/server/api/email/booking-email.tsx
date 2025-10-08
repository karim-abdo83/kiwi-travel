import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
  Img,
} from '@react-email/components';

interface BookingEmailProps {
  bookingId: number;
  bookingLink: string;
  translations: (key: string) => string;
  bookingData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    bookingDate: string;
    numberOfPeople: number;
    totalAmount: number;
    tripTitle: string;
    additionalNotes?: string;
  };
  isAdminCopy?: boolean;
}

export const BookingEmail = ({
  bookingId,
  bookingLink,
  translations: t,
  bookingData,
  isAdminCopy = false,
}: BookingEmailProps) => {
  const title = t("title");
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- HEADER --- */}
          <Section style={headerSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src="/logo-footer.svg"
                alt="Karim Tour Logo"
                width="80"
                height="80"
              />
              <div>
                <Heading style={{ ...voucherTitle, margin: '0 0 5px 0' }}>{t("voucherTitle")}</Heading>
                <Text style={contactText}>
                  <b>+201003637624</b> &nbsp; - &nbsp; <b>+905352699881</b>
                </Text>
              </div>
            </div>
          </Section>

          {/* --- TABLE --- */}
          <Section style={tableSection}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Details</th>
                  <th style={th}>Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={td}>Ticket Number</td>
                  <td style={td}>{bookingId}</td>
                </tr>
                <tr>
                  <td style={td}>Name & Family Name</td>
                  <td style={td}>{bookingData.fullName}</td>
                </tr>
                <tr>
                  <td style={td}>Service (Trip)</td>
                  <td style={td}>{bookingData.tripTitle}</td>
                </tr>
                <tr>
                  <td style={td}>Number of Persons</td>
                  <td style={td}>{bookingData.numberOfPeople}</td>
                </tr>
                <tr>
                  <td style={td}>Trip Price</td>
                  <td style={td}>${bookingData.totalAmount}</td>
                </tr>
                <tr>
                  <td style={td}>Payment Method</td>
                  <td style={td}>Online</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <Heading as="h3" style={termsTitle}>
              {t("termsTitle")}
            </Heading>
            <Text style={termsText}>
              {t("termsText")}
              are subject to the International Travel Agencies Law (Law No.
              1254) and the Consumer Protection Law (Law No. 4077), as amended
              to align with the European Union Consumer Rights Law.
            </Text>

            <Text style={termsSub}>
              <b>{t("termsSub")}</b>
              <br />
              {t("termsSubText")}
            {t("agreementText")}
            </Text>

            <ol style={termsList}>
              <li>
                <b>{t("termsList1")}</b> {t("termsList1Text")}
                <ul>
                  <li>{t("flights")}</li>
                  <li>{t("internationalTrips")}</li>
                  <li>
                   {t("tripsWithTickets")}
                  </li>
                  <li>{t("privatePrograms")}</li>
                </ul>
              </li>
              <li>
                <b>{t("termsList2")}</b> {t("termsList2Text")}
              </li>
              <li>
                <b>{t("termsList3")}</b> {t("termsList3Text")}
              </li>
              <li>
                <b>{t("termsList4")}</b> {t("termsList4Text")}
              </li>
            </ol>
          </Section>

          {/* --- FOOTER --- */}
          <Hr style={hr} />
          <Text style={footer}>
            {t("bestRegards")} <br />
            <b>{t("teamName")}</b>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// --- STYLES ---

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '"Arial", "Helvetica Neue", Helvetica, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '10px 0 40px',
  width: '650px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
};

const headerSection = {
  padding: '20px',
  borderBottom: '3px solid #c00000',
  backgroundColor: '#fff',
};

const voucherTitle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#000',
  margin: '0',
};

const contactText: React.CSSProperties = {
  color: '#0000FF',
  fontSize: '14px',
  marginTop: '4px',
  textAlign: 'center' as const,
};

const tableSection = {
  padding: '10px 25px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  border: '1px solid #000',
};

const th = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #000',
  padding: '8px',
  fontWeight: '700',
  textAlign: 'left' as const,
  fontSize: '14px',
};

const td = {
  border: '1px solid #000',
  padding: '8px',
  fontSize: '14px',
  color: '#000',
  fontWeight: 'bold',
};

const termsSection = {
  padding: '20px 25px',
};

const termsTitle = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#c00000',
  marginBottom: '10px',
};

const termsText = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#000',
};

const termsSub = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#000',
  marginTop: '10px',
};

const termsList = {
  fontSize: '13px',
  color: '#000',
  marginTop: '8px',
  paddingLeft: '18px',
};

const hr = {
  borderColor: '#ccc',
  margin: '20px 0',
};

const footer = {
  color: '#444',
  fontSize: '12px',
  marginTop: '10px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#c00000',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: '600',
};

