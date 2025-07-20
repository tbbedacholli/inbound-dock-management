// app/page.js
'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../styles/theme';
import InboundDashboard from '../components/InboundDashboard/InboundDashboard';

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InboundDashboard />
    </ThemeProvider>
  );
}