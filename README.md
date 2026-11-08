# appfactorial.com

Static website for App Factorial LLC, hosted on GitHub Pages at <https://appfactorial.com>.

Plain HTML and CSS, with no build step. Edit the files and push to `main` to publish.

```
index.html                 Home page (apps, toolbox, contact)
gaffe/                     App pages
false-positive/
beach-ball-runner/
privacy/                   Privacy policy (linked from the App Store listings)
404.html
assets/css/style.css       All styles
assets/img/                Logo, icons, screenshots
CNAME                      Custom domain for GitHub Pages
```

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Hosting setup (one time)

### 1. Turn on GitHub Pages

In the repo on GitHub: **Settings → Pages**

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- **Custom domain:** `appfactorial.com` (already set by the `CNAME` file)

### 2. Point the Namecheap domain at GitHub

In Namecheap: **Domain List → appfactorial.com → Manage → Advanced DNS**.
Delete the existing parking-page records (the `URL Redirect` / `CNAME www → parkingpage.namecheap.com` entries), then add:

| Type         | Host  | Value                   |
|--------------|-------|-------------------------|
| A Record     | `@`   | `185.199.108.153`       |
| A Record     | `@`   | `185.199.109.153`       |
| A Record     | `@`   | `185.199.110.153`       |
| A Record     | `@`   | `185.199.111.153`       |
| CNAME Record | `www` | `jon-bown.github.io.`   |

Optional IPv6 (AAAA records, host `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Keep any MX / mail records** so `apps@appfactorial.com` keeps working.

DNS can take up to an hour or so to propagate. Check with `dig appfactorial.com +short`.

### 3. Enable HTTPS

Once GitHub shows the DNS check as successful under **Settings → Pages**, tick **Enforce HTTPS**. The certificate can take a few minutes to issue.

It's also worth verifying the domain under your GitHub account (**Settings → Pages → Add a domain**) so nobody else can claim it for their Pages site.

### 4. Update the App Store listings

The App Store privacy policy links currently point at the old Wix site. In App Store Connect, change the Privacy Policy URL for Gaffe, False Positive and Beach Ball Runner to:

```
https://appfactorial.com/privacy/
```

Do this before you cancel or unpublish the Wix site.
