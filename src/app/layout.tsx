import { Metadata } from 'next';
import './globals.css'
import { Montserrat } from 'next/font/google'
import "bootstrap-icons/font/bootstrap-icons.css"
// import { Poltawski_Nowy } from 'next/font/google';

export const metadata: Metadata = {
  title: "Bibleway",
  description: "Your favorite Bible App",
};

// const poltawskiNowy = Poltawski_Nowy({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-poltawski',
// });

const montserrat = Montserrat({
    subsets: ['latin'],
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="pt-BR">
<body className={`${montserrat.className} tracking-tight bg-background text-text`}>
{children}
</body>
</html>
)
}

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="pt-BR" className={poltawskiNowy.variable}>
//       <body>{children}</body>
//     </html>
//   );
// }