# Vero Design & Build — Vercel-ready package

**Website domain:** https://www.verodesignandbuild.com  
**Enquiry inbox:** Enquiries@verodesignandbuild.co.uk  
**Call / SMS / WhatsApp:** +44 7581 240938

## Deploy

1. Create a private GitHub repository named `vero-design-build`.
2. Upload the contents of this folder to the repository root.
3. In Vercel, choose **Add New → Project** and import that GitHub repository.
4. Framework preset: **Other**. Leave build command and output directory blank.
5. In Vercel → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY` = your Resend API key
   - optional: `ENQUIRY_TO_EMAIL` = `Enquiries@verodesignandbuild.co.uk`
   - optional: `RESEND_FROM_EMAIL` = `Vero Website <website@verodesignandbuild.com>`
6. In Resend, verify the sending domain `verodesignandbuild.com`.
7. Redeploy after adding the environment variable.
8. Test the enquiry form on the temporary `.vercel.app` URL.
9. In Vercel → Project → Settings → Domains, add:
   - `verodesignandbuild.com`
   - `www.verodesignandbuild.com`
10. Follow the DNS records Vercel gives you. Do not remove the MX records used by the existing `@verodesignandbuild.co.uk` email.

## Contact routing

- Calls: `tel:+447581240938`
- SMS: `sms:+447581240938`
- WhatsApp: `https://wa.me/447581240938`
- Website forms: `/api/enquiry` → Resend → `Enquiries@verodesignandbuild.co.uk`

## Content note

The Claude handover explicitly described the project case studies and reviews as illustrative placeholders. This package intentionally does not publish those placeholders as genuine work or testimonials. Add verified project case studies and genuine reviews before enabling them.
