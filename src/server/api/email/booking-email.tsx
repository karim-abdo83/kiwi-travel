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
  Row,
  Column,
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
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTAwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjUwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3N2I3Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktBUklNIFRPVVI8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMWVtIj5Zb3VyIHRyYXZlbCBwYXJ0bmVyPC90ZXh0Pgo8L3N2Zz4="
                  alt="Karim Tour"
                  width="150"
                  height="50"
                  style={logo}
                />
              </Column>
              <Column style={voucherColumn}>
                <Heading style={voucherHeading}>TOURISTS VOUCHER</Heading>
                <Text style={phoneText}>
                  +201003637624 - +905352699881
                </Text>
              </Column>
            </Row>
          </Section>

          {/* --- TABLE --- */}
          <Section style={tableSection}>
            <table style={mainTable}>
              <thead>
                <tr>
                  <th style={thLeft}>Details</th>
                  <th style={thRight}>Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdLeft}>Ticket Number</td>
                  <td style={tdRight}>{bookingId}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>Name & Family Name</td>
                  <td style={tdRight}>{bookingData.fullName}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>Service (Trip)</td>
                  <td style={tdRight}>{bookingData.tripTitle}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>Number of Persons</td>
                  <td style={tdRight}>{bookingData.numberOfPeople}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>Trip Price</td>
                  <td style={tdRight}>${bookingData.totalAmount}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>Payment Method</td>
                  <td style={tdRight}>Online</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <Heading style={termsHeading}>Terms and Conditions</Heading>
            
            <Text style={termsIntro}>
              All orders, pre-bookings, and trips made through www.karimtor.com are subject to the International Travel Agencies Law (Law No. 1254) and the Consumer Protection Law (Law No. 4077), as substantially amended to align with the European Union Consumer Rights Law.
            </Text>

            <Text style={termsSubject}>
              <strong>Subject of the Agreement</strong>
              <br />
              The travel agency "Karim Tour" (hereinafter referred to as "the Contractor") is obliged to provide services and organize trips. The customer (hereinafter referred to as "the Client") is obliged to pay the cost of the selected trips and comply with the terms of this agreement.
            </Text>

            <Text style={termsParagraph}>
              <strong>1- Cancellation by the Client:</strong> The Client has the right to cancel the trip up to 12 hours before its start without paying any penalties, except for trips that include:
            </Text>
            <ul style={termsList}>
              <li>Flights</li>
              <li>Trips to another country</li>
              <li>Trips that include entrance tickets (e.g. Aquapark, Dolphin Show, Cable Car, Hot Air Balloon)</li>
              <li>Private and individual programs</li>
            </ul>

            <Text style={termsParagraph}>
              <strong>2- Late Cancellation:</strong> If the cancellation is made on the same day of the trip or less than 12 hours before departure, the Client is not entitled to any refund.
            </Text>

            <Text style={termsParagraph}>
              <strong>3- Accuracy of Information:</strong> All information displayed on our website is valid, and Karim Tour is committed to providing exactly what is stated in the itinerary of each trip.
            </Text>

            <Text style={termsParagraph}>
              <strong>4- Right of Refusal:</strong> Karim Tour reserves the right to cancel a Client's participation in a trip in cases of misconduct or failure to respect others, including but not limited to:
            </Text>
            <ul style={termsList}>
              <li>Intoxication</li>
              <li>Harassment</li>
              <li>Disrespectful behavior towards staff (employees, tour guides, drivers, etc.)</li>
            </ul>

            <Text style={termsParagraph}>
              <strong>5- Punctuality During the Trip:</strong> In the event that the Client does not return to the bus at the time specified by the tour guide, the tour guide reserves the right to continue the tour without the delayed Client, in order to avoid any inconvenience or delays for the rest of the group.
            </Text>

            <Text style={termsParagraph}>
              <strong>6 - Itinerary Adjustments:</strong> All itineraries are approximate and may be changed by the tour guide or driver due to weather conditions, traffic congestion, safety considerations, or other unforeseen circumstances.
            </Text>

            <Text style={termsParagraph}>
              <strong>7- Tour Timing:</strong> The start and end times of the tours are approximate and may vary depending on circumstances.
            </Text>
          </Section>

          {/* --- FOOTER --- */}
          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              Best regards, <br />
              <b>Karim Tour Team</b>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- STYLES ---

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Arial", "Helvetica Neue", Helvetica, sans-serif',
  padding: '20px 10px',
};

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '650px',
  width: '100%',
  backgroundColor: '#fff',
  border: '2px solid #000000',
};

const headerSection = {
  padding: '20px 30px',
  borderBottom: '3px solid #c00000',
};

const logoColumn = {
  width: '180px',
  verticalAlign: 'middle',
  paddingRight: '20px',
};

const logo = {
  display: 'block',
  maxWidth: '150px',
  height: 'auto',
};

const voucherColumn = {
  verticalAlign: 'middle',
  textAlign: 'center' as const,
};

const voucherHeading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#000000',
  margin: '0 0 8px 0',
  textDecoration: 'underline',
  letterSpacing: '1px',
  whiteSpace: 'nowrap' as const,
};

const phoneText = {
  fontSize: '16px',
  color: '#0066cc',
  fontWeight: '600',
  margin: '0',
  whiteSpace: 'nowrap' as const,
};

const tableSection = {
  padding: '20px 30px',
  maxHeight: 'none' as const,
};

const mainTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  border: '2px solid #000000',
};

const thLeft = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #000000',
  padding: '12px 15px',
  fontWeight: '700',
  textAlign: 'center' as const,
  fontSize: '15px',
  color: '#000000',
  width: '40%',
};

const thRight = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #000000',
  padding: '12px 15px',
  fontWeight: '700',
  textAlign: 'center' as const,
  fontSize: '15px',
  color: '#000000',
  width: '60%',
};

const tdLeft = {
  border: '1px solid #000000',
  padding: '10px 15px',
  fontSize: '14px',
  color: '#000000',
  fontWeight: '600',
  backgroundColor: '#ffffff',
};

const tdRight = {
  border: '1px solid #000000',
  padding: '10px 15px',
  fontSize: '14px',
  color: '#000000',
  backgroundColor: '#ffffff',
};

const termsSection = {
  padding: '25px 30px 30px',
  maxHeight: 'none' as const,
};

const termsHeading = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#cc0000',
  marginBottom: '15px',
  textDecoration: 'underline',
};

const termsIntro = {
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#000000',
  marginBottom: '15px',
};

const termsSubject = {
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#000000',
  marginBottom: '15px',
};

const termsParagraph = {
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#000000',
  marginBottom: '10px',
  marginTop: '10px',
};

const termsList = {
  fontSize: '13px',
  color: '#000000',
  marginTop: '5px',
  marginBottom: '10px',
  paddingLeft: '40px',
  lineHeight: '1.6',
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