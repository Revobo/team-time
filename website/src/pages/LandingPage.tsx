import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { landingPageTestIds } from "@testIds/landingPageTestIds";

export function LandingPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography
          data-testid={landingPageTestIds.heading}
          variant="h2"
          component="h1"
          fontWeight="bold"
        >
          Team Time
        </Typography>

        <Typography
          data-testid={landingPageTestIds.tagline}
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 480 }}
        >
          The effortless way to bring your team together.
        </Typography>

        <Typography
          data-testid={landingPageTestIds.description}
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480 }}
        >
          Say goodbye to endless email chains and calendar chaos. Team Time
          makes scheduling happy hours, coffee chats, and team lunches
          ridiculously simple. One click, everyone's in, memories made.
        </Typography>

        <Button
          data-testid={landingPageTestIds.getStartedButton}
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
