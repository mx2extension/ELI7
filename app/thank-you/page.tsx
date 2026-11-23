import Link from 'next/link';
import { CheckCircle2, Heart, ArrowRight, HandHeart } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] px-4 py-16 text-[#293241] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-2 border-[#0A0A0A] bg-white p-7 sm:p-12 text-center shadow-[8px_8px_0px_#0A0A0A]">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#00897B]/10">
            <CheckCircle2 className="h-12 w-12 text-[#00897B]" strokeWidth={1.8} />
          </div>

          <p className="mb-3 inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#C62828] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
            <Heart className="h-3.5 w-3.5 fill-white" /> ELI7 Foundation
          </p>

          <h1 className="mb-5 font-['Bricolage_Grotesque'] text-3xl font-extrabold leading-tight sm:text-5xl">
            Thank You for Extending Love!
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-base leading-8 text-[#293241]/80 sm:text-lg">
            Your donation has been received successfully. Your generosity means so much to us, and we are grateful that you have chosen to be part of our work.
          </p>

          <div className="my-8 border-y-2 border-[#0A0A0A] py-6">
            <HandHeart className="mx-auto mb-3 h-8 w-8 text-[#C62828]" />
            <h2 className="mb-2 text-lg font-extrabold">Your kindness creates impact.</h2>
            <p className="text-sm leading-7 text-[#293241]/75">
              Every contribution helps us reach more people, strengthen communities, and support meaningful initiatives—including our programes to support persons with disabilities as we help create a truly inclusive world.
            </p>
          </div>

          <p className="mb-8 text-sm leading-7 text-[#293241]/75">
            Thank you for believing in our mission at a time as this. Together, we can make a difference and extend love to people that need it the most.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-[#293241] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#C62828]"
            >
              Return to Homepage <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center border-2 border-[#0A0A0A] bg-white px-6 py-3.5 text-sm font-bold text-[#293241] transition-colors hover:bg-[#F4F1EA]"
            >
              Make Another Donation
            </Link>
          </div>

          <p className="mt-8 text-xs text-[#293241]/60">
            Questions about your donation? Contact us at{' '}
            <a className="font-bold text-[#C62828] underline" href="mailto:eli7foundation@gmail.com">
              eli7foundation@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
