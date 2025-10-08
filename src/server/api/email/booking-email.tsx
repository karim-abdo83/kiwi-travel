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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src="/logo-footer.svg"
                alt="Karim Tour Logo"
                width="80"
                height="80"
              />
              <div>
                <Heading style={{ ...voucherTitle, margin: '0 0 5px 0' }}>TOURISTS VOUCHER</Heading>
                <Text style={contactText}>
                  <b>+201003637624</b> &nbsp; - &nbsp; <b>+905352699881</b>
                </Text>
              </div>
            </div>
          </Section>

          {/* --- TABLE --- */}
          <Section style={detailsSection}>
            <div style={detailRow}>
              <span style={detailLabel}>Ticket Number</span>
              <span style={detailValue}>{bookingId}</span>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Name & Family Name</span>
              <span style={detailValue}>{bookingData.fullName}</span>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Service (Trip)</span>
              <span style={detailValue}>{bookingData.tripTitle}</span>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Number of Persons</span>
              <span style={detailValue}>{bookingData.numberOfPeople}</span>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Trip Price</span>
              <span style={detailValue}>${bookingData.totalAmount}</span>
            </div>
            <div style={detailRow}>
              <span style={detailLabel}>Payment Method</span>
              <span style={detailValue}>Online</span>
            </div>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <Heading as="h3" style={termsTitle}>
              Terms and Conditions
            </Heading>
            <Text style={termsText}>
              All orders, pre-bookings, and trips made through www.karimtor.com
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

const contactText: React.CSSProperties = {
  fontSize: '14px',
  marginTop: '4px',
  textAlign: 'center' as const,
};

const detailsSection = {
  padding: '15px',
  maxWidth: '600px',
  margin: '0 auto',
};

const detailRow = {
  display: 'flex',
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  padding: '12px 0',
  borderBottom: '1px solid #eee',
  alignItems: 'center',
  '@media (max-width: 600px)': {
    flexDirection: 'column' as const,
  },
};

const detailLabel = {
  flex: '1 1 40%',
  fontWeight: 'bold',
  padding: '8px 0',
  color: '#333',
  minWidth: '150px',
  '@media (max-width: 600px)': {
    flex: '1 1 100%',
    textAlign: 'left' as const,
  },
};

const detailValue = {
  flex: '1 1 60%',
  padding: '8px 0',
  color: '#000',
  '@media (max-width: 600px)': {
    flex: '1 1 100%',
    textAlign: 'left' as const,
  },
};

const termsSection = {
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

