---
id: self-hosted-domains
---

# Self Hosted Domains

If you are on a paid Pro or Enterprise plan, you can host Web AR experiences on
your own web server (and view them without device authorization). In order to do
so, you will need to specify a list of domains that are approved to host your
project.

1. From the Project Dashboard page, select "Setup domains".

2. Expand "Setup this project for self-hosting or local development".

3. Enter the domain(s) or IP(s) of the web server where you will be self-hosting
the project. A domain may not contain a wildcard, path, or port. Click the "+"
to add multiple.

Note: Self-Hosted domains are **subdomain specific** - e.g. `mydomain.com` is NOT the same as
`www.mydomain.com`. If you will be hosting at both mydomain.com and `www.mydomain.com`, you must
specify **BOTH**.

![SelfHostedDomainList](/images/console-app-key-origins.jpg)
