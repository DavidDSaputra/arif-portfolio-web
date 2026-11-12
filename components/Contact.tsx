"use client";

import { contact, profile, sectionCopy } from "@/lib/content";
import { ArrowUpRight, CircleBadge, Download, Instagram, Mail, WhatsApp } from "./icons";
import { Kicker, Pill, Reveal } from "./ui";

const rows = [
  { label: "WhatsApp", value: contact.whatsapp.display, href: contact.whatsapp.href, Icon: WhatsApp },
  { label: "Instagram", value: contact.instagram.display, href: contact.instagram.href, Icon: Instagram },
  { label: "Email", value: contact.email.display, href: contact.email.href, Icon: Mail },
];

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-sky/30 blur-[140px]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-32">
        <Reveal>
          <Kicker title={sectionCopy.contact.kicker} tag="[LET'S WORK TOGETHER]" />
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <a
            href={contact.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Let's talk — chat WhatsApp ${contact.whatsapp.display}`}
            className="group mt-6 inline-flex items-end gap-4"
          >
            <h2 id="contact-title" className="display text-[clamp(4.5rem,19vw,16rem)] text-blue transition-colors duration-300 group-hover:text-navy">
              {sectionCopy.contact.title}
            </h2>
            <ArrowUpRight className="mb-[3%] h-[clamp(2.5rem,8vw,7rem)] w-[clamp(2.5rem,8vw,7rem)] shrink-0 text-blue transition-transform duration-500 group-hover:rotate-45" />
          </a>
          <CircleBadge
            text="HUBUNGI SAYA • GET IN TOUCH • "
            className="absolute -top-6 right-0 hidden h-36 w-36 text-fg/70 motion-safe:animate-spin-slow lg:block"
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <ul className="lg:col-span-8">
            {rows.map(({ label, value, href, Icon }) => (
              <li key={label} className="border-t border-line last:border-b">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 py-5 transition-colors hover:text-navy sm:gap-6"
                >
                  <Icon className="h-7 w-7 shrink-0 text-blue" />
                  <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-mute">{label}</span>
                  <span className="min-w-0 break-all font-mono text-base sm:text-xl">{value}</span>
                  <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end lg:justify-end">
            <Pill href={profile.cv.href} download ariaLabel={`${profile.cv.label}, file PDF`}>
              <Download className="h-4 w-4" />
              {profile.cv.label}
            </Pill>
            <Pill href={contact.email.href} variant="ghost">
              <Mail className="h-4 w-4" />
              Kirim Email
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
