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
                  src="/logo.svg"
                  alt={t('companyName') || 'Karim Tour'}
                  height="100"
                  style={logo}
                />
              </Column>
              <Column style={voucherColumn}>
                <Heading style={voucherHeading}>{t('bookingEmail.voucherTitle')}</Heading>
                <Text style={phoneText}>
                  {t('bookingEmail.phone1')} - {t('bookingEmail.phone2')}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* --- TABLE --- */}
          <Section style={tableSection}>
            <table style={mainTable}>
              <thead>
                <tr>
                  <th style={thLeft}>{t('bookingEmail.details')}</th>
                  <th style={thRight}>{t('bookingEmail.information')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.ticketNumber')}</td>
                  <td style={tdRight}>{bookingId}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.fullName')}</td>
                  <td style={tdRight}>{bookingData.fullName}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.service')}</td>
                  <td style={tdRight}>{bookingData.tripTitle}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.numberOfPersons')}</td>
                  <td style={tdRight}>{bookingData.numberOfPeople}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.tripPrice')}</td>
                  <td style={tdRight}>${bookingData.totalAmount}</td>
                </tr>
                <tr>
                  <td style={tdLeft}>{t('bookingEmail.paymentMethod')}</td>
                  <td style={tdRight}>{t('bookingEmail.paymentOnline')}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <Heading style={termsHeading}>{t('bookingEmail.termsAndConditions')}</Heading>
            
            <Text style={termsIntro}>
              {t('bookingEmail.termsText')}
            </Text>

            <Text style={termsSubject}>
              <strong>{t('bookingEmail.subjectOfAgreement')}</strong>
              <br />
              {t('bookingEmail.agreementText')}
            </Text>

            <Text style={termsParagraph}>
              <strong>{t('bookingEmail.cancellationByClient')}:</strong> {t('bookingEmail.cancellationPolicy')}
            </Text>
            <ul style={termsList}>
              <li>{t('bookingEmail.flights')}</li>
              <li>{t('bookingEmail.internationalTrips')}</li>
              <li>{t('bookingEmail.tripsWithTickets')}</li>
              <li>{t('bookingEmail.privatePrograms')}</li>
            </ul>

            <Text style={termsParagraph}>
              <strong>{t('bookingEmail.lateCancellation')}:</strong> {t('bookingEmail.lateCancellationPolicy')}
            </Text>

            <Text style={termsParagraph}>
              <strong>{t('bookingEmail.accuracy')}:</strong> {t('bookingEmail.accuracyPolicy')}
            </Text>

            <Text style={termsParagraph}>
              <strong>{t('bookingEmail.rightOfRefusal')}:</strong> {t('bookingEmail.refusalPolicy')}
            </Text>
          </Section>

          {/* --- FOOTER --- */}
          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              {t('bookingEmail.bestRegards')} <br />
              <b>{t('bookingEmail.teamName')}</b>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
)};

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