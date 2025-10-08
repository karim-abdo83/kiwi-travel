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
                <Heading style={{ ...voucherTitle, margin: '0 0 5px 0' }}>{t('bookingEmail.voucherTitle')}</Heading>
                <Text style={contactText}>
                  <b>{t('bookingEmail.phone1')}</b> &nbsp; - &nbsp; <b>{t('bookingEmail.phone2')}</b>
                </Text>
              </div>
            </div>
          </Section>

          {/* --- DETAILS SECTION --- */}
          <Section style={detailsSection}>
            <div style={detailRow(0)}>
              <span style={detailLabel}>{t('bookingEmail.ticketNumber')}</span>
              <span style={detailValue}>{bookingId}</span>
            </div>
            <div style={detailRow(1)}>
              <span style={detailLabel}>{t('bookingEmail.fullName')}</span>
              <span style={detailValue}>{bookingData.fullName}</span>
            </div>
            <div style={detailRow(0)}>
              <span style={detailLabel}>{t('bookingEmail.service')}</span>
              <span style={detailValue}>{bookingData.tripTitle}</span>
            </div>
            <div style={detailRow(1)}>
              <span style={detailLabel}>{t('bookingEmail.numberOfPersons')}</span>
              <span style={detailValue}>{bookingData.numberOfPeople}</span>
            </div>
            <div style={detailRow(0)}>
              <span style={detailLabel}>{t('bookingEmail.tripPrice')}</span>
              <span style={detailValue}>${bookingData.totalAmount}</span>
            </div>
            <div style={detailRow(1)}>
              <span style={detailLabel}>{t('bookingEmail.paymentMethod')}</span>
              <span style={detailValue}>{t('bookingEmail.online')}</span>
            </div>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <Heading as="h3" style={termsTitle}>
              {t('bookingEmail.termsAndConditions')}
            </Heading>
            <Text style={termsText}>
              {t('bookingEmail.termsText')}
            </Text>

            <Text style={termsSub}>
              <b>{t('bookingEmail.subjectOfAgreement')}</b>
              <br />
              {t('bookingEmail.agreementText')}
            </Text>

            <ol style={termsList}>
              <li>
                <b>{t('bookingEmail.cancellationByClient')}:</b> {t('bookingEmail.cancellationPolicy')}
                <ul>
                  <li>{t('bookingEmail.flights')}</li>
                  <li>{t('bookingEmail.internationalTrips')}</li>
                  <li>{t('bookingEmail.tripsWithTickets')}</li>
                  <li>{t('bookingEmail.privatePrograms')}</li>
                </ul>
              </li>
              <li>
                <b>{t('bookingEmail.lateCancellation')}:</b> {t('bookingEmail.lateCancellationPolicy')}
              </li>
              <li>
                <b>{t('bookingEmail.accuracy')}:</b> {t('bookingEmail.accuracyPolicy')}
              </li>
              <li>
                <b>{t('bookingEmail.rightOfRefusal')}:</b> {t('bookingEmail.refusalPolicy')}
              </li>
            </ol>
          </Section>

          {/* --- FOOTER --- */}
          <Hr style={hr} />
          <Text style={footer}>
            {t('bookingEmail.bestRegards')}, <br />
            <b>{t('bookingEmail.teamName')}</b>
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

const detailRow = (index: number) => ({
  display: 'flex',
  flexDirection: 'row' as const,
  flexWrap: 'nowrap' as const,
  padding: '12px 8px',
  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
  borderRadius: '4px',
  marginBottom: '4px',
  '@media (max-width: 600px)': {
    flexDirection: 'row' as const,
    flexWrap: 'nowrap' as const,
    alignItems: 'flex-start',
    padding: '10px 8px',
  },
});

const detailLabel = {
  flex: '0 0 150px',
  fontWeight: 600,
  padding: '6px 8px',
  color: '#333',
  fontSize: '14px',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  '@media (max-width: 600px)': {
    flex: '0 0 120px',
    padding: '4px 8px',
    fontSize: '13px',
  },
};

const detailValue = {
  flex: '1 1 auto',
  padding: '6px 8px',
  color: '#000',
  fontSize: '14px',
  wordBreak: 'break-word' as const,
  '@media (max-width: 600px)': {
    padding: '4px 8px',
    fontSize: '13px',
    flex: '1 1 100%',
    textAlign: 'left' as const,
  },
};

const termsSection = {
};

const termsTitle = {
  fontSize: '16px',
  fontWeight: 'semi-bold',
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

