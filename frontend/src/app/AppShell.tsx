import { Box, Container, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

/**
 * Application shell: layout wrapper for all pages.
 * Provides consistent header and content area.
 */
export function AppShell() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{
          py: 2,
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" component="h1">
            Skill Matrix
          </Typography>
        </Container>
      </Box>
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
