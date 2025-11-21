import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import { Toaster } from "react-hot-toast";
import Providers from "./redux/Providers";


export const metadata = {
  title: "Trust Consult – Expert Consultancy Platform",
  description: "Book online video consultations with trusted experts. Chat, video call and get personalized guidance instantly.",
  keywords: [
    "consultant",
    "online consultation",
    "expert advice",
    "video consultation",
    "professional consultant",
  ],
  authors: [{ name: "Trust Consult" }],
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className="bg-gray-900">
          <Providers>
            <Navbar />
            {children}
            <Toaster
              toastOptions={{
                loading: {
                  style: {
                    background: "#1e293b",
                    color: "#38bdf8",
                    border: "1px solid #38bdf8",
                  },
                  iconTheme: {
                    primary: "#38bdf8",
                    secondary: "#1e293b",
                  },
                },
                success: {
                  style: {
                    background: "#0f172a",
                    color: "#22d3ee",
                    border: "1px solid #22d3ee",
                  },
                  iconTheme: {
                    primary: "#22d3ee",
                    secondary: "#0f172a",
                  },
                },
                error: {
                  style: {
                    background: "#7f1d1d",
                    color: "#fecaca",
                  },
                  iconTheme: {
                    primary: "#fecaca",
                    secondary: "#7f1d1d",
                  },
                },
              }}
            />
          </Providers>
        </body>
    </html>
  );
}
