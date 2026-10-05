Paste this into Google AI Studio > Build if you want AI Studio to generate the app itself
instead of importing the code. Then compare its result with public/index.html.

---

Build "TitleLens", a web app for Bengaluru advocates who prepare legal scrutiny reports on property
files for banks. Use React for the frontend and call Gemini only from the server, never from the browser.

Data: hard-code one fictional sample matter, "Flat 304, Sample Residency, Sy. No. 45/2, Sample Village,
Bengaluru Urban", labelled "SAMPLE FILE, FICTIONAL PROPERTY". Include:
- Documents with pages: D1 sale deed 2011 (B. Ramaiah to S. Lakshmamma, SMP-1-02841-2011);
  D2 gift deed 2014 (S. Lakshmamma to K. Ravi Kumar, SMP-1-05530-2014); D3 sale deed 2019 (Anitha Rao to
  Sample Builders LLP, SMP-1-07714-2019, whose recital says Anitha Rao bought from K. Ravi Kumar under
  SMP-1-03312-2017); D4 release deed 2023 (Sample Bank Ltd releases mortgage SMP-1-04410-2020);
  D5 occupancy certificate (Flat 304 built-up 1,180 sq ft); D6 agreement to sell 2026 (Sample Builders LLP
  to Purchaser, Flat 304, 1,240 sq ft super built-up); D7 e-khata in the name of Sample Builders LLP.
- EC rows F1 to F5 for 2013-04-01 to 2026-09-30: the 2014 gift, a 2017 sale SMP-1-03312-2017 (deed NOT in
  the file), the 2019 sale, the 2020 mortgage, the 2023 release.

Screens, on one page:
1. Title chain timeline built by plain code (not by the AI) from EC rows and documents. A transfer in the
   EC whose deed is not in the file shows as a red "Missing link".
2. Checks: mortgage released or open; flat area agreement vs OC (show both, never decide);
   survey number consistent; EC coverage period.
3. EC table and the list of documents with their pages.
4. "Ask this file": example question chips, a question box, answers with citation tags like [1] or [F2],
   and a collapsible "Retrieval trace" showing the retrieved pages with scores and the full prompt.

Answering: retrieve the top 6 pages by keyword match (boost exact document numbers; treat Lakshmamma /
Laxmamma and Ramaiah / Ramayya as the same name; include each document's parties in its search text).
Send Gemini these rules plus the EC rows, the code-built chain and the retrieved pages:
cite every sentence; copy names, numbers and areas exactly; never infer a missing chain link; if the file
doesn't answer, say "I couldn't find this in the file"; never say a title is clear, a deed is genuine or a
bank should lend; show disagreements side by side; draft a one-line requisition when a document is missing.
After the answer, run a code validator: every document number, sq ft figure and rupee amount in the
answer must appear in the sources, and every citation must point to a real source. Show pass or the flags.
