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
              <Column style={logoColumn}>
                <Img
                  src="https://www.karimtor.com/logo.png"
                  alt="Karim Tour Logo"
                  width="120"
                  height="auto"
                  style={logoStyle}
                />
              </Column>
              <Column style={voucherColumn}>
                <Heading style={voucherTitle}>TOURISTS VOUCHER</Heading>
                <Text style={contactText}>
                  +201003637624 &nbsp; - &nbsp; +905352699881
                </Text>
              </Column>
            </Row>
          </Section>

          {/* --- TABLE --- */}
          <Section style={tableSection}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th} colSpan={2}>Booking Details</th>
                </tr>
              </thead>
              <tbody>
                <tr style={rowStyle}>
                  <td style={td}><strong>Ticket Number</strong></td>
                  <td style={td}>{bookingId}</td>
                </tr>
                <tr style={altRowStyle}>
                  <td style={td}><strong>Name & Family Name</strong></td>
                  <td style={td}>{bookingData.fullName}</td>
                </tr>
                <tr style={rowStyle}>
                  <td style={td}><strong>Service (Trip)</strong></td>
                  <td style={td}>{bookingData.tripTitle}</td>
                </tr>
                <tr style={altRowStyle}>
                  <td style={td}><strong>Number of Persons</strong></td>
                  <td style={td}>{bookingData.numberOfPeople}</td>
                </tr>
                <tr style={rowStyle}>
                  <td style={td}><strong>Trip Price</strong></td>
                  <td style={td}><strong>${bookingData.totalAmount}</strong></td>
                </tr>
                <tr style={altRowStyle}>
                  <td style={td}><strong>Payment Method</strong></td>
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
              All orders, pre-bookings, and trips made through www.karimtor.com
              are subject to the International Travel Agencies Law (Law No.
              1254) and the Consumer Protection Law (Law No. 4077), as amended
              to align with the European Union Consumer Rights Law.
            </Text>

            <Text style={termsSub}>
              <b>Subject of the Agreement</b>
              <br />
              The travel agency "Karim Tour" (hereinafter referred to as "the
              Contractor") is obliged to provide services and organize trips.
              The customer (hereinafter referred to as "the Client") is obliged
              to pay the cost of the selected trips and comply with the terms of
              this agreement.
            </Text>
          </Section>

          {/* --- FOOTER --- */}
          <Section style={footerSection}>
            <Text style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
              Thank you for choosing Karim Tour!
            </Text>
            <Text style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>
              © {new Date().getFullYear()} Karim Tour. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- STYLES ---

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: 'Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: 0,
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headerSection: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#1e3a8a',
  color: '#ffffff',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoColumn: React.CSSProperties = {
  width: '30%',
  textAlign: 'left' as const,
};

const voucherColumn: React.CSSProperties = {
  width: '70%',
  textAlign: 'right' as const,
};

const logoStyle = {
  maxWidth: '120px',
  height: 'auto',
};

const voucherTitle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  color: '#ffffff',
  textTransform: 'uppercase',
};

const contactText = {
  margin: '10px 0 0 0',
  fontSize: '16px',
  color: '#ffffff',
  fontWeight: 'bold',
};

const tableSection = {
  padding: '20px',
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
};

const th: React.CSSProperties = {
  backgroundColor: '#1e3a8a',
  color: '#ffffff',
  padding: '12px 18px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '16px',
};

const rowStyle = {
  backgroundColor: '#ffffff',
};

const altRowStyle = {
  backgroundColor: '#f8f9fa',
};

const td = {
  padding: '12px 18px',
  borderBottom: '1px solid #e2e8f0',
  fontSize: '14px',
};

const termsSection = {
  padding: '0 20px 20px',
};

const termsTitle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 12px',
  color: '#1e3a8a',
  textAlign: 'center',
  textTransform: 'uppercase',
  paddingBottom: '8px',
  borderBottom: '2px solid #1e3a8a',
};

const termsText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '0 0 16px',
  textAlign: 'justify',
};

const termsSub = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f8fafc',
  borderRadius: '4px',
  borderLeft: '3px solid #1e3a8a',
};

const footerSection: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#1e3a8a',
  color: '#ffffff',
  textAlign: 'center',
  fontSize: '14px',
  lineHeight: '1.5',
};

