export const metadata = {
  title: '越智通AI平台',
  description: '越智通AI平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
