import './globals.css'

export const metadata = {
  title: 'Wall Calendar',
  description: 'Interactive wall calendar component',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
