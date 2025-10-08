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
  const title = isAdminCopy ? t('adminTitle') : t('title');
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- HEADER --- */}
          <Section style={headerSection}>
            <Row>
              <Column style={{ width: '30%' }}>
                <img
                  src="/logo-footer.svg" // Replace with actual Karim Tour logo URL
                  alt="Karim Tour Logo"
                  width="80"
                  height="80"
                />
              </Column>
              <Column style={{ width: '70%', textAlign: 'right' }}>
                <Heading style={voucherTitle}>TOURISTS VOUCHER</Heading>
                <Text style={contactText}>
                  <b>+201003637624</b> &nbsp; - &nbsp; <b>+905352699881</b>
                </Text>
              </Column>
            </Row>
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
              Terms and Conditions
            </Heading>
            <Text style={termsText}>
              All orders, pre-bookings, and trips made through www.karimtour.com
              are subject to the International Travel Agencies Law (Law No.
              1254) and the Consumer Protection Law (Law No. 4077), as amended
              to align with the European Union Consumer Rights Law.
            </Text>

            <Text style={termsSub}>
              <b>Subject of the Agreement</b>
              <br />
              The travel agency “Karim Tour” (hereinafter referred to as “the
              Contractor”) is obliged to provide services and organize trips.
              The customer (hereinafter referred to as “the Client”) is obliged
              to pay the cost of the selected trips and comply with the terms of
              this agreement.
            </Text>

            <ol style={termsList}>
              <li>
                <b>Cancellation by the Client:</b> The Client has the right to
                cancel up to 12 hours before without penalty, except for:
                <ul>
                  <li>Flights</li>
                  <li>Trips to another country</li>
                  <li>
                    Trips that include entrance tickets (Aquapark, Dolphin Show,
                    Cable Car, Hot Air Balloon)
                  </li>
                  <li>Private and individual programs</li>
                </ul>
              </li>
              <li>
                <b>Late Cancellation:</b> If cancellation is made on the same
                day or less than 12 hours before, no refund is provided.
              </li>
              <li>
                <b>Accuracy of Information:</b> All displayed information is
                valid, and Karim Tour commits to the exact itinerary listed.
              </li>
              <li>
                <b>Right of Refusal:</b> Karim Tour reserves the right to cancel
                participation for misconduct or intoxication, harassment, or
                disrespectful behavior towards staff or drivers.
              </li>
            </ol>
          </Section>

          {/* --- FOOTER --- */}
          <Hr style={hr} />
          <Text style={footer}>
            Best regards, <br />
            <b>Karim Tour Team</b>
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

const contactText = {
  color: '#333',
  fontSize: '14px',
  marginTop: '4px',
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

