# starvechaos.com

Home of *Hunger, Curiosity & Chaos: 101 Ways Entrepreneurs Think* and its class materials.

- **Open pages:** home, `/book/` and `/class/` contents lists, `/open/` notes, `/about/`
- **Locked pages:** every book chapter (`/book/01/` … `/book/12/`) and class chapter (`/class/01/` … `/class/12/`), each with its own password
- Mobile-first, no web fonts or images, so it loads fast on phone data

## How it's built

| Path | What it is |
|---|---|
| `src/config.mjs` | Site title, tagline and the 12 sections. Edit this to rename anything. |
| `src/styles.css` | All styling |
| `build.mjs` | Turns the above into plain HTML in `public/` (no dependencies) |
| `functions/_middleware.js` | Checks the password cookie before serving any chapter page |
| `functions/api/login.js` | Checks a password and unlocks one chapter on that device for 60 days |
| `functions/api/logout.js` | "Lock this device" link at the bottom of each chapter |
| `lib/auth.js` | Shared password and cookie logic |

Hosted on **Cloudflare Pages** (free). Every push to `main` rebuilds the site.

## One-time setup

### 1. Connect the repo to Cloudflare Pages
1. Make a free account at dash.cloudflare.com.
2. **Workers & Pages → Create → Pages → Connect to Git**, pick `starvechaos`.
3. Build settings: **Build command** `node build.mjs`, **Build output directory** `public`.
4. Deploy. You'll get a test address like `starvechaos.pages.dev`.

### 2. Set the passwords
In the Pages project: **Settings → Variables and secrets**, add these as **Secret** (encrypted), then redeploy:

| Name | Value |
|---|---|
| `AUTH_SECRET` | Any long random string (40+ characters). Never share it. |
| `ACCESS_CODES` | One password per chapter, e.g. `{"class-01":"hunger","class-02":"opening","book-01":"owner"}` |
| `ADMIN_CODE` | Your own master password; opens every chapter |

A chapter with no password listed stays closed ("This chapter isn't open yet"). To open the next class chapter, add its line and redeploy. Changing a chapter's password locks out everyone who used the old one.

### 3. Point starvechaos.com at Cloudflare
1. In Cloudflare: **Add a domain** → `starvechaos.com` → Free plan.
2. Cloudflare scans your existing DNS records. **Delete** the four `A` records (185.199.x.153) and the `www` CNAME to `github.io`; those were for GitHub Pages.
3. Cloudflare shows two nameservers (like `xxx.ns.cloudflare.com`).
4. In Namecheap: **Domain List → Manage → Nameservers → Custom DNS**, paste both, save. Takes from minutes to a few hours.
5. Back in the Pages project: **Custom domains → Set up a domain** → add `starvechaos.com`, then `www.starvechaos.com`.

Redirect domains (hungercuriositychaos.com, hccbook.com) can be added the same way later.

## Working on it locally
```
node build.mjs                       # builds public/
npx wrangler pages dev public        # runs the site with the password gate
```
For local testing, put test values in a `.dev.vars` file (it's git-ignored):
```
AUTH_SECRET=localtest
ACCESS_CODES={"book-01":"test"}
ADMIN_CODE=admin
```
