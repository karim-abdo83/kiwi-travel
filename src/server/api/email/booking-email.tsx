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
  Button,
} from '@react-email/components';

interface BookingEmailProps {
  bookingId: number;
  bookingLink: string;
  translations:   (key: string) => string;
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
  const title = t('title');
  const buttonText = t("buttonText");
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
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMTA4IDMwNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjEwOCAzMDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMxMjU0QzI7fQ0KCS5zdDF7ZmlsbDojRkY4MTA2O30NCjwvc3R5bGU+DQo8Zz4NCgk8Zz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQxNC44Niw0MS4wM3YyNi44NmMwLDIuNTUtMi4wNyw0LjYyLTQuNjIsNC42MmgtNTMuNjJjLTIuNTUsMC00LjYyLDIuMDctNC42Miw0LjYydjE4Mi4yNQ0KCQkJCQljMCwyLjU1LTIuMDcsNC42Mi00LjYyLDQuNjJoLTM2LjIxYy0yLjU1LDAtNC42Mi0yLjA3LTQuNjItNC42MlY3Ny4xM2MwLTIuNTUtMi4wNy00LjYyLTQuNjItNC42MmgtNTMuMw0KCQkJCQljLTIuNTUsMC00LjYyLTIuMDctNC42Mi00LjYyVjQxLjAzYzAtMi41NSwyLjA3LTQuNjIsNC42Mi00LjYyaDE2MS42MkMxNDEyLjc5LDM2LjQxLDE0MTQuODYsMzguNDcsMTQxNC44Niw0MS4wM3oiLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAzMi4xNiwyNjEuNzZsLTUwLjUtODQuMTdjLTAuODQtMS4zOS0yLjM0LTIuMjQtMy45Ni0yLjI0aC0xMi43NWMtMi41NSwwLTQuNjIsMi4wNy00LjYyLDQuNjJ2NzkuNDENCgkJCQkJYzAsMi41NS0yLjA3LDQuNjItNC42Miw0LjYyaC0zNi4yMWMtMi41NSwwLTQuNjItMi4wNy00LjYyLTQuNjJWNDEuMDNjMC0yLjU1LDIuMDctNC42Miw0LjYyLTQuNjJoODIuMQ0KCQkJCQljMjYuNDQsMCw0Ni41OCw2LjQ1LDYwLjQ1LDE5LjM0YzEzLjg2LDEyLjksMjAuNzksMjkuODgsMjAuNzksNTAuOTRjMCwxNy4yLTQuNzksMzEuNTktMTQuMzUsNDMuMg0KCQkJCQljLTguNDYsMTAuMjctMjAuMjQsMTcuNTEtMzUuMzQsMjEuNzJjLTIuOTgsMC44My00LjM1LDQuMjYtMi43MSw2Ljg5bDQ4Ljk2LDc4LjQ1YzEuOTIsMy4wOC0wLjI5LDcuMDctMy45Miw3LjA3aC0zOS4zNQ0KCQkJCQlDMjAzNC41LDI2NC4wMSwyMDMyLjk5LDI2My4xNSwyMDMyLjE2LDI2MS43NnogTTE5NjAuMzIsMTM5LjQ2YzAsMi41NSwyLjA3LDQuNjIsNC42Miw0LjYyaDMyLjc4YzI2LDAsMzkuMDEtMTEuNDksMzkuMDEtMzQuNQ0KCQkJCQljMC0xMC45Ni0zLjE3LTE5LjUtOS41MS0yNS42M2MtNi4zNC02LjEzLTE2LjE3LTkuMTktMjkuNS05LjE5aC0zMi43OGMtMi41NSwwLTQuNjIsMi4wNy00LjYyLDQuNjJWMTM5LjQ2eiIvPg0KCQkJCTxnPg0KCQkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTczMy44NywzMi4wMWMwLjg0LDAuMTEsMS40MiwwLjg5LDEuMjgsMS43MnYwbC0wLjc4LDUuMDRsLTAuOTcsNi44NWMtMC42Miw0LjU4LTEuMTksOS4xOS0xLjcyLDEzLjgxDQoJCQkJCQljLTEuMDUsOS4yNC0xLjkyLDE4LjUxLTIuNTksMjcuNzhjLTEuMzMsMTguNTUtMS45MSwzNy4xMi0xLjMxLDU1LjQ5YzAuMzEsOS4xOCwwLjkxLDE4LjMyLDEuOTQsMjcuMzINCgkJCQkJCWMxLjAyLDksMi40NywxNy44Nyw0LjUyLDI2LjQ0YzIuMDUsOC41NSw0LjcyLDE2LjgyLDguMjgsMjQuMjhjMS43OCwzLjczLDMuNzgsNy4yNCw2LjA0LDEwLjQyYzIuMjUsMy4xOSw0Ljc1LDYuMDQsNy41LDguNDQNCgkJCQkJCWMyLjc1LDIuNDEsNS43NCw0LjM5LDkuMDEsNS44N2MzLjI3LDEuNDcsNi44LDIuNDcsMTAuNTcsMi45OWMwLjk1LDAuMTEsMS44OSwwLjIzLDIuODYsMC4yOGwwLjczLDAuMDVsMC43OCwwLjA0DQoJCQkJCQljMC41MiwwLjAyLDEuMDUsMC4wNywxLjU2LDAuMDdjMi4wOSwwLjA4LDQuMTUsMC4wNSw2LjIxLTAuMDdjNC4xLTAuMjQsOC4xNC0wLjg1LDEyLjAzLTEuOTQNCgkJCQkJCWM3Ljc4LTIuMTUsMTUuMDEtNi4xOSwyMS4yMS0xMS45M2M2LjIxLTUuNzIsMTEuMzctMTMsMTUuNTItMjEuMDFjNC4xNi04LjAxLDcuMzYtMTYuNzMsOS44Ni0yNS43MQ0KCQkJCQkJYzIuNS04Ljk5LDQuMzEtMTguMjYsNS42Mi0yNy42NGMxLjMxLTkuMzgsMi4xMS0xOC44NywyLjUtMjguNDFjMC4zNy05LjUzLDAuNC0xOS4xMS0wLjE4LTI4LjY4DQoJCQkJCQljMS42NSw5LjQ1LDIuNzEsMTkuMDIsMy40MiwyOC42M2MwLjY5LDkuNjEsMC45NywxOS4yOCwwLjcyLDI4Ljk5Yy0wLjI1LDkuNy0xLjAyLDE5LjQ1LTIuNTcsMjkuMTcNCgkJCQkJCWMtMS41Niw5LjcyLTMuODksMTkuNDQtNy41MiwyOC45M2MtMy42Myw5LjQ2LTguNjEsMTguNzYtMTUuNjMsMjYuOTJjLTMuNSw0LjA3LTcuNTIsNy44Mi0xMS45OSwxMS4wNg0KCQkJCQkJYy00LjQ2LDMuMjQtOS4zNyw1Ljk1LTE0LjUxLDguMDRjLTUuMTQsMi4xLTEwLjUxLDMuNTYtMTUuOSw0LjVjLTIuNywwLjQ3LTUuNDEsMC44Mi04LjExLDEuMDINCgkJCQkJCWMtMC42OCwwLjA3LTEuMzUsMC4wOS0yLjAzLDAuMTRsLTEuMDIsMC4wNmwtMS4wNywwLjAyYy0xLjQyLDAuMDQtMi44NiwwLTQuMzEtMC4wNWMtNS43OC0wLjI2LTExLjY4LTEuMzItMTcuMzYtMy4zDQoJCQkJCQljLTUuNjctMS45Ny0xMS4wNC00Ljg2LTE1LjgzLTguMzVjLTQuOC0zLjQ5LTkuMDItNy41Ni0xMi42OS0xMS44OWMtMy42OS00LjMzLTYuODQtOC45My05LjYxLTEzLjYyDQoJCQkJCQljLTUuNTMtOS40MS05LjU4LTE5LjItMTIuODYtMjkuMDJjLTMuMjctOS44My01Ljc1LTE5Ljc0LTcuNzQtMjkuNjVjLTItOS45MS0zLjUxLTE5LjgyLTQuNjktMjkuNzMNCgkJCQkJCWMtMi4zNS0xOS44MS0zLjQxLTM5LjU5LTMuNjgtNTkuMzJjLTAuMTMtOS44Ny0wLjA1LTE5LjcyLDAuMjItMjkuNTljMC4xNC00LjkzLDAuMzMtOS44NywwLjU3LTE0LjgyDQoJCQkJCQljMC4xMi0yLjQ4LDAuMjYtNC45NiwwLjQyLTcuNDVsMC40My02LjE1YzAuMDctMC44NCwwLjgzLTEuNDYsMS42Ny0xLjM1TDE3MzMuODcsMzIuMDF6Ii8+DQoJCQkJCTxnPg0KCQkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4NjYuMDgsMzIuNjNjLTAuMTIsNS4wNS0wLjI2LDEwLjEzLTAuNzQsMTUuMTZjLTAuMjYsMi44MiwwLjUyLDQuODgsMi4yOSw2Ljk5DQoJCQkJCQkJYzUsNi4wNCw5Ljg2LDEyLjE4LDE0LjYzLDE4LjRjMC43OSwxLjA1LDEuMjMsMi42NywxLjE3LDQuMDFjLTAuMTUsMy42My0wLjY2LDcuMjYtMS4wOCwxMS41MQ0KCQkJCQkJCWMtNi40My01LjExLTEyLjM3LTkuODItMTguNzItMTQuODdjLTAuMTksMS41MS0wLjI5LDIuNTUtMC40NSwzLjU4Yy0xLjE4LDcuMTItMi4zLDE0LjI4LTMuNTgsMjEuNA0KCQkJCQkJCWMtMC41OCwzLjI5LTIuNjEsNS4zOC01Ljc1LDYuNjNjLTYuNDMsMi41OS0xMi43OCw1LjQtMTkuMjUsOC4xNWMtMS4zNy02LjUyLDEuODItMTAuOTMsNS44LTE0LjgyDQoJCQkJCQkJYzMuODYtMy43Nyw1LjMtOC4xNSw1LjcyLTEzLjQ2YzEuMi0xNC45NCwyLjcxLTI5Ljg2LDQuNTMtNDQuNzNjMC40Ny0zLjkxLDIuMjgtNy43MywzLjkxLTExLjQxYzEuMS0yLjQ3LDIuOTYtNC42NSw2LjMtMy43Mg0KCQkJCQkJCUMxODYzLjk5LDI2LjMyLDE4NjYuMTYsMjkuMTcsMTg2Ni4wOCwzMi42M3oiLz4NCgkJCQkJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xODQ3Ljg3LDUxLjU4Yy0wLjYsNS45NS0xLjM2LDExLTEuNTQsMTYuMDdjLTAuMTQsMy45LTEuNjQsNi4yNi01LjE2LDcuOTgNCgkJCQkJCQljLTQuMDcsMi03Ljg2LDQuNTctMTIuMjYsNy4xOGMwLjE3LTQuNTYsMC4yOS04LjUxLDAuNDgtMTIuNDVjMC4wNC0wLjY0LDAuMjctMS40NSwwLjcxLTEuODcNCgkJCQkJCQlDMTgzNS43Nyw2My4wNCwxODQxLjQ5LDU3LjY0LDE4NDcuODcsNTEuNTh6Ii8+DQoJCQkJCTwvZz4NCgkJCQk8L2c+DQoJCQkJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTU0Ni43MSIgY3k9IjE1My41OCIgcj0iNzkuMjkiLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTU0Ni43MSw2OC4wMkwxNTQ2LjcxLDY4LjAyYzMuNDMsMCw2LjI0LTIuODEsNi4yNC02LjI0VjQyLjI0YzAtMy40My0yLjgxLTYuMjQtNi4yNC02LjI0aDANCgkJCQkJYy0zLjQzLDAtNi4yNCwyLjgxLTYuMjQsNi4yNHYxOS41NUMxNTQwLjQ4LDY1LjIxLDE1NDMuMjgsNjguMDIsMTU0Ni43MSw2OC4wMnoiLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYwNy4zMiw5My4xOUwxNjA3LjMyLDkzLjE5YzIuNDIsMi40Myw2LjM5LDIuNDQsOC44MiwwLjAybDEzLjg0LTEzLjhjMi40My0yLjQyLDIuNDQtNi4zOSwwLjAyLTguODJ2MA0KCQkJCQljLTIuNDItMi40My02LjM5LTIuNDQtOC44Mi0wLjAybC0xMy44NCwxMy44QzE2MDQuOSw4Ni43OSwxNjA0Ljg5LDkwLjc2LDE2MDcuMzIsOTMuMTl6Ii8+DQoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2MzIuMjcsMTUzLjg4TDE2MzIuMjcsMTUzLjg4Yy0wLjAxLDMuNDMsMi43OSw2LjI1LDYuMjIsNi4yNmwxOS41NSwwLjA3YzMuNDMsMC4wMSw2LjI1LTIuNzksNi4yNi02LjIyDQoJCQkJCXYwYzAuMDEtMy40My0yLjc5LTYuMjUtNi4yMi02LjI2bC0xOS41NS0wLjA3QzE2MzUuMSwxNDcuNjUsMTYzMi4yOCwxNTAuNDQsMTYzMi4yNywxNTMuODh6Ii8+DQoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2MDYuOSwyMTQuMzlMMTYwNi45LDIxNC4zOWMtMi40NCwyLjQxLTIuNDYsNi4zOC0wLjA1LDguODJsMTMuNzUsMTMuODljMi40MSwyLjQ0LDYuMzgsMi40Niw4LjgyLDAuMDV2MA0KCQkJCQljMi40NC0yLjQxLDIuNDYtNi4zOCwwLjA1LTguODJsLTEzLjc1LTEzLjg5QzE2MTMuMzEsMjEyLDE2MDkuMzQsMjExLjk4LDE2MDYuOSwyMTQuMzl6Ii8+DQoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1NDYuMTIsMjM5LjE0TDE1NDYuMTIsMjM5LjE0Yy0zLjQzLTAuMDItNi4yNiwyLjc2LTYuMjgsNi4xOWwtMC4xNCwxOS41NQ0KCQkJCQljLTAuMDIsMy40MywyLjc2LDYuMjYsNi4xOSw2LjI4bDAsMGMzLjQzLDAuMDIsNi4yNi0yLjc2LDYuMjgtNi4xOWwwLjE0LTE5LjU1QzE1NTIuMzQsMjQxLjk5LDE1NDkuNTUsMjM5LjE2LDE1NDYuMTIsMjM5LjE0eiINCgkJCQkJLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQ4NS43LDIxMy41NUwxNDg1LjcsMjEzLjU1Yy0yLjQxLTIuNDUtNi4zNy0yLjQ4LTguODItMC4wOGwtMTMuOTQsMTMuN2MtMi40NSwyLjQtMi40OCw2LjM3LTAuMDgsOC44MnYwDQoJCQkJCWMyLjQxLDIuNDUsNi4zNywyLjQ4LDguODIsMC4wOGwxMy45NC0xMy43QzE0ODguMDcsMjE5Ljk3LDE0ODguMSwyMTYsMTQ4NS43LDIxMy41NXoiLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQ2MS4xNiwxNTIuNjlMMTQ2MS4xNiwxNTIuNjljMC4wNC0zLjQzLTIuNzQtNi4yNy02LjE3LTYuM2wtMTkuNTQtMC4yYy0zLjQzLTAuMDQtNi4yNywyLjc0LTYuMyw2LjE3djANCgkJCQkJYy0wLjA0LDMuNDMsMi43NCw2LjI3LDYuMTcsNi4zbDE5LjU0LDAuMkMxNDU4LjI5LDE1OC45LDE0NjEuMTIsMTU2LjEyLDE0NjEuMTYsMTUyLjY5eiIvPg0KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNDg2Ljk1LDkyLjM1TDE0ODYuOTUsOTIuMzVjMi40Ni0yLjQsMi41LTYuMzcsMC4xMS04LjgybC0xMy42NS0xMy45OWMtMi40LTIuNDYtNi4zNy0yLjUtOC44Mi0wLjExdjANCgkJCQkJYy0yLjQ2LDIuNC0yLjUsNi4zNy0wLjExLDguODJsMTMuNjUsMTMuOTlDMTQ4MC41Myw5NC43LDE0ODQuNSw5NC43NSwxNDg2Ljk1LDkyLjM1eiIvPg0KCQkJPC9nPg0KCQkJPGc+DQoJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTczNS4zNiwyNjEuMzJsLTQ5LjgtODMuMDFjLTAuODItMS4zNy0yLjMxLTIuMjEtMy45MS0yLjIxaC0xMi41OGMtMi41MiwwLTQuNTYsMi4wNC00LjU2LDQuNTZ2NzguMzINCgkJCQkJYzAsMi41Mi0yLjA0LDQuNTYtNC41Niw0LjU2aC0zNS43MmMtMi41MiwwLTQuNTYtMi4wNC00LjU2LTQuNTZWNDMuNjNjMC0yLjUyLDIuMDQtNC41Niw0LjU2LTQuNTZoODAuOTcNCgkJCQkJYzI2LjA3LDAsNDUuOTQsNi4zNiw1OS42MSwxOS4wOHMyMC41MSwyOS40NiwyMC41MSw1MC4yM2MwLDE2Ljk2LTQuNzIsMzEuMTYtMTQuMTUsNDIuNmMtOC4zNSwxMC4xMi0xOS45NiwxNy4yNi0zNC44NiwyMS40Mg0KCQkJCQljLTIuOTQsMC44Mi00LjI5LDQuMjEtMi42OCw2Ljc5bDQ4LjI5LDc3LjM3YzEuODksMy4wNC0wLjI5LDYuOTctMy44Nyw2Ljk3aC0zOC44QzczNy42NywyNjMuNTMsNzM2LjE4LDI2Mi42OSw3MzUuMzYsMjYxLjMyeg0KCQkJCQkgTTY2NC41MiwxNDAuN2MwLDIuNTIsMi4wNCw0LjU2LDQuNTYsNC41NmgzMi4zMmMyNS42NCwwLDM4LjQ3LTExLjM0LDM4LjQ3LTM0LjAyYzAtMTAuODEtMy4xMy0xOS4yMy05LjM4LTI1LjI4DQoJCQkJCXMtMTUuOTUtOS4wNi0yOS4wOS05LjA2aC0zMi4zMmMtMi41MiwwLTQuNTYsMi4wNC00LjU2LDQuNTZWMTQwLjd6Ii8+DQoJCQkJPGc+DQoJCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01ODguMzMsMjU5LjYxYy0yLjQ0LDQuMzgtNi43OCwzLjM3LTEwLjYzLDMuMzdjLTkxLjY4LDAuMDItMTgzLjM2LDAuMDQtMjc1LjAzLDAuMDINCgkJCQkJCWMtNS44NywwLTkuMzktNi41Mi02LjE2LTExLjQybDc2LjUxLTExNi44NGMwLjIyLTAuMjUsMC40MS0wLjUzLDAuNjEtMC44MmMxLjI0LTEuODgsMi4yMS0zLjMxLDIuOS00LjUzdi0wLjAybDEwLjgtMTYuNQ0KCQkJCQkJbDAuMDQtMC4wNGMxLjA5LTEuNTYsMS44Mi0yLjU4LDIuNS0zLjYzYzE1LjA5LTIyLjg4LDMwLjE1LTQ1Ljc3LDQ1LjIzLTY4LjY3YzQuMTgtNi4zNCw5LjMyLTYuMjgsMTMuNTEsMC4xMw0KCQkJCQkJYzMuNjQsNS41Niw3LjMsMTEuMTEsMTAuOTUsMTYuNjRjNDIsNjMuNzIsODMuOTcsMTI3LjQxLDEyNS45NSwxOTEuMTNDNTg3LjcyLDI1MS44LDU5MC44MSwyNTUuMTEsNTg4LjMzLDI1OS42MXoiLz4NCgkJCQk8L2c+DQoJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTg2MC4zMiw0My44NXYyMTUuMTJjMCwyLjUxLTIuMDQsNC41NS00LjU1LDQuNTVoLTM1LjY4Yy0yLjUxLDAtNC41NS0yLjA0LTQuNTUtNC41NVY0My44NQ0KCQkJCQljMC0yLjUxLDIuMDQtNC41NSw0LjU1LTQuNTVoMzUuNjhDODU4LjI4LDM5LjMsODYwLjMyLDQxLjM0LDg2MC4zMiw0My44NXoiLz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTE0Mi42Nyw0Ni4zOXYyMTIuNThjMCwyLjUxLTIuMDQsNC41NS00LjU1LDQuNTVoLTM1LjM2Yy0yLjUxLDAtNC41NS0yLjA0LTQuNTUtNC41NVYxMzQuNDQNCgkJCQkJYzAtNS4wOC03LjA3LTYuMzQtOC44Mi0xLjU3bC00Ni45MywxMjcuNjhjLTAuNjYsMS43OS0yLjM2LDIuOTgtNC4yNywyLjk4aC0zMi40Yy0xLjkxLDAtMy42MS0xLjE5LTQuMjctMi45OEw5NTQuNTgsMTMzLjQNCgkJCQkJYy0xLjc2LTQuNzctOC44Mi0zLjUxLTguODIsMS41OHYxMjRjMCwyLjUxLTIuMDQsNC41NS00LjU1LDQuNTVoLTM1LjY4Yy0yLjUxLDAtNC41NS0yLjA0LTQuNTUtNC41NVY0Ni4zOQ0KCQkJCQljMC0yLjUxLDIuMDQtNC41NSw0LjU1LTQuNTVoNDYuNjljMS44NiwwLDMuNTMsMS4xMyw0LjIyLDIuODVsNjEuOTIsMTUzLjM0YzEuNTQsMy44MSw2Ljk0LDMuNzksOC40NS0wLjAzbDYwLjczLTE1My4yOQ0KCQkJCQljMC42OS0xLjc0LDIuMzctMi44OCw0LjIzLTIuODhoNDYuMzVDMTE0MC42Myw0MS44NCwxMTQyLjY3LDQzLjg4LDExNDIuNjcsNDYuMzl6Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyNy4zNywxNjMuMThjOS4yNywxMS4wOCwxOC40MSwyMiwyNy41NCwzMi45MmM0LjgsNS43NSw5LjYxLDExLjQ5LDE0LjM5LDE3LjI1DQoJCQljMi4xLDIuNTMsNC42NSwzLjczLDguMDMsMy42NmM2Ljg3LTAuMTUsMTMuNzYsMC4xLDIwLjYzLTAuMTJjMS42MS0wLjA1LDMuNzUtMC45NCw0LjU2LTIuMTZjMC41NC0wLjgxLTAuNDgtMy4yMS0xLjQ0LTQuMzgNCgkJCWMtMTguMzUtMjIuNjItMzYuOC00NS4xNi01NS4yMi02Ny43MmMtMC41OC0wLjcxLTEuMDgtMS40OC0xLjYtMi4yYzE2Ljc0LTMwLjYsODguODQtOTcuNTMsMTA3LjM0LTk5LjI4DQoJCQljLTMuOSw1LjI5LTcuNjMsMTAuMzQtMTEuNCwxNS40NWMzLjg2LDQuMDYsNy43Niw3LjgxLDExLjI2LDExLjkyYzExLjg4LDEzLjkxLDIwLjM3LDI5LjczLDI1LjA3LDQ3LjM4DQoJCQljMTAuMiwzOC4yOCw1LjcxLDc0LjYzLTE2LjIzLDEwNy45N2MtMTguOTUsMjguOC00NS45NCw0Ni4zMy03OS42NCw1My4yM2MtMTkuMzQsMy45Ni0zOC42NiwzLjc5LTU3LjY4LTIuMzQNCgkJCWMtMTcuNTYtNS42Ni0yNi44LTE4LjE4LTI3LjI4LTM2LjU1Yy0wLjQxLTE1LjU2LDQuMjQtMjkuNzYsMTEuNjUtNDMuMDVjNS44OC0xMC41NCwxMi42OC0yMC41NywxOS4wOC0zMC44Mw0KCQkJQzEyNi42NSwxNjQsMTI2LjkzLDE2My43MiwxMjcuMzcsMTYzLjE4eiIvPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMjUuNjIsNDcuNjNjLTQ5Ljk0LDI2LjM2LTg4LjU3LDY0Ljk1LTEyMy4wNCwxMDguNTNjMi4xNS00LjA2LDQuMjItOC4xNiw2LjQ4LTEyLjE3DQoJCQkJYzEuNTEtMi42OCwzLjAyLTUuNDIsNC45OC03Ljc2YzIuOTktMy41NiwzLjU3LTcuNDksMy41LTExLjk2Yy0wLjItMTIuNzMtMC4wNS0yNS40Ni0wLjA2LTM4LjE5YzAtNS44Ny0yLjctOC42Mi04LjYyLTguNjkNCgkJCQljLTQuMS0wLjA1LTguMi0wLjAzLTEyLjMsMC4wNWMtMy42LDAuMDgtNi4zLDIuNzQtNi41OCw2LjMzYy0wLjA1LDAuNzEtMC4wMiwxLjQ0LTAuMDIsMi4xNmMwLDI5LjA1LDAuMDMsNTguMTEtMC4wNiw4Ny4xNg0KCQkJCWMtMC4wMSwxLjgzLTAuNTksMy45MS0xLjU3LDUuNDRjLTkuOTIsMTUuNC0xNS44MywzMi4xNi0xNi41NSw1MC40N2MtMC4yNSw2LjM3LDAuODQsMTIuODQsMS44MiwxOS4xOA0KCQkJCWMwLjQyLDIuNzEsMi4xMiw1LjIzLDMuMDYsNy40M2MtOC4zNy00LjAxLTI5Ljc3LTI5LjU4LTM4LjA5LTQ1LjkyYy05LjQ1LTE4LjU1LTE0LjEzLTM4LjQxLTEzLjMtNTkuMDQNCgkJCQljMi4xMi01Mi41OSwyNy4yMy05MC45Niw3NS4xLTExMi42NEMxNDMuMzIsMTguNTUsMTg1LjUyLDIyLjY2LDIyNS42Miw0Ny42M3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K"
                  alt="Karim Tour Logo"
                  width="150"
                  height="100"
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
          <Section style={{ textAlign: 'center', padding: '0 30px 30px' }}>
            <Button style={{
              backgroundColor: '#007BFF',
              color: '#fff',
              padding: '12px 30px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              minWidth: '200px',
              margin: '20px auto 0',
              textAlign: 'center' as const
            }} href={bookingLink}>
              {buttonText}
            </Button>
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
const button = {
  backgroundColor: '#007BFF',
  color: '#fff',
  padding: '12px 30px',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  display: 'inline-block',
  minWidth: '200px',
  margin: '20px auto 0',
  textAlign: 'center' as const
};