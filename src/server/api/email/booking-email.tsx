import {
  Html, Body,
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
  const description = isAdminCopy ? t('adminDescription') : t('description');
  const buttonText = t('buttonText');

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{title}</Heading>

          <Section style={section}>
            <Text style={text}>{description}</Text>

            {/* Booking Details Section */}
            <Section style={detailsSection}>
              <Heading as="h3" style={sectionHeading}>
                Booking Details
              </Heading>

              <DetailRow label="Booking ID:" value={bookingId.toString()} />
              <DetailRow label="Trip:" value={bookingData.tripTitle} />
              <DetailRow
                label="Date:"
                value={new Date(bookingData.bookingDate).toLocaleDateString()}
              />
              <DetailRow
                label="Number of People:"
                value={bookingData.numberOfPeople.toString()}
              />
              <DetailRow
                label="Total Amount:"
                value={`$${bookingData.totalAmount}`}
              />
            </Section>

            {/* Customer Information Section */}
            <Section style={detailsSection}>
              <Heading as="h3" style={sectionHeading}>
                Customer Information
              </Heading>

              <DetailRow label="Full Name:" value={bookingData.fullName} />
              <DetailRow label="Email:" value={bookingData.email} />
              <DetailRow label="Phone:" value={bookingData.phoneNumber} />

              {bookingData.additionalNotes && (
                <DetailRow
                  label="Additional Notes:"
                  value={bookingData.additionalNotes}
                />
              )}
            </Section>

            {!isAdminCopy && (
              <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button style={button} href={bookingLink}>
                  {buttonText}
                </Button>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          {/* Terms and Conditions Section */}
          <Section style={termsSection}>
            <Heading as="h4" style={termsHeading}>
              Terms & Conditions:
            </Heading>
            <ul style={termsList}>
              <li>All bookings are subject to availability.</li>
              <li>Full payment is required at the time of booking confirmation.</li>
              <li>Cancellation policy: 50% refund if cancelled 15 days before the tour date. No refund for cancellations within 7 days of the tour.</li>
              <li>Karim Tour is not responsible for any loss, injury, or damage to personal belongings during the tour.</li>
              <li>The itinerary may be subject to change due to weather conditions or unforeseen circumstances.</li>
              <li>Participants must follow the guide's instructions at all times for their safety.</li>
              <li>Travel insurance is recommended for all participants.</li>
              <li>By booking this tour, you agree to these terms and conditions.</li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Best regards,
            <br />
            Karim Tour Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Row>
    <Column style={detailColumn}>
      <Text style={labelStyle}>{label}</Text>
    </Column>
    <Column style={detailValueColumn}>
      <Text style={text}>{value}</Text>
    </Column>
  </Row>
);

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.5',
  fontWeight: '600',
  color: '#333',
};

const section = {
  padding: '24px',
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  marginTop: '20px',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#333',
};

const labelStyle = {
  ...text,
  fontWeight: '600',
  color: '#2c3e50',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#007BFF',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '4px',
  display: 'inline-block',
  textDecoration: 'none',
  marginTop: '16px',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '16px',
};

const termsSection = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f5f7fa',
  borderRadius: '6px',
  fontSize: '12px',
  lineHeight: '1.5',
  color: '#4a5568',
};

const termsHeading = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 12px 0',
};

const termsList = {
  margin: '0',
  paddingLeft: '20px',
};

const detailsSection = {
  margin: '20px 0',
  padding: '16px',
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
};

const sectionHeading = {
  fontSize: '18px',
  color: '#2c3e50',
  margin: '0 0 16px 0',
  paddingBottom: '8px',
  borderBottom: '1px solid #eaeaea',
};

const detailColumn = {
  width: '40%',
  paddingRight: '16px',
  verticalAlign: 'top',
};

const detailValueColumn = {
  width: '60%',
  verticalAlign: 'top',
};