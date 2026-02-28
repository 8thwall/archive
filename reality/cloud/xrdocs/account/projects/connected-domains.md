---
id: connected-domains
sidebar_position: 4
---

# Connected Domains

When using the 8th Wall Cloud Editor to develop, the Web AR experience created is published to 8th Wall's hosting infrastructure. The default URL of your published Web AR experience will have the following format:

"**workspace-name**.8thwall.app/**project-name**"

If you own a custom domain and want to use it with an 8th Wall hosted project instead of the default URL, you can connect the domain to your 8th Wall project by adding a few DNS records. To do so, you'll need access to create/edit the DNS configuration for your domain.

**NOTE**: Connecting custom domains to 8th Wall Hosted projects requires a **Pro or Enterprise** plan.

**WARNING**: It is strongly recommended that you connect a **subdomain** ("ar.mydomain.com") instead of the root domain ("mydomain.com" without anything in front) as **not all DNS providers support CNAME/ALIAS/ANAME records for the root domain**. Please contact your DNS provider to see if they support CNAME or ALIAS records for the root domain before proceeding.

1. From the Project Dashboard page, select "Setup domains"

![SetupConnectedDomains](/images/connected-domains-setup-domains.png)

2. Expand "Setup your domain to point to this 8th Wall-hosted project"

3. In **Step 1** of the connected domain wizard, enter your **custom domain** (e.g. www.mydomain.com), in the Primary connected domain field.

![ConnectedDomains](/images/console-appkey-domains.png)

4. [Optional] If you want to connect additional sub-domains, click the **Add additional sub domain** button and add any **additional domains** you want connected. **Note**: If you connect additional sub-domains, these will redirect back to the primary connected domain. They must share the same root as the primary connected domain.

![AdditionalConnectedDomains](/images/console-appkey-domains-additional.png)

5. Click **Connect**. At this point 8th Wall will generate an SSL certificate for the custom domain(s) being connected. This operation can take a few minutes, so please be patient. Click the "Refresh status" button if needed.

6. Next, **Verify ownership** of your domain. In order to verify that you are the owner of the custom domain, you must login to your DNS provider's website and add one or more verification CNAME records.  Use the **Copy** button to ensure you properly collect the complete Host and Value records.

![ConnectedDomainVerificationRecord](/images/connected-domain-verification-record.png)

These DNS records can take up to 24 hours to be verified, but in most cases happens in a matter of minutes.  Please be patient and click the "Refresh verification status" button periodically if needed.

When verification has completed, you'll see a green checkmark next to the verification DNS record:

![ConnectedDomainVerified](/images/connected-domain-verified.png)

7. Finally, **Step 3** will display one or more CNAME (if connecting a sub-domain) or ANAME (if connecting a root-domain, see warning above) records that need to be added to your DNS server to finish the connected domain setup. These records map your custom domain to 8th Wall's hosting infrastructure.

![ConnectedDomainConnectionRecord](/images/connected-domain-connection-record.png)

Result: Connection Record Verified:

![ConnectedDomainConnectionEstablished](/images/connected-domain-connection-established.png)

Additional notes:

* If you are connecting a **root** domain, Step 3 will display an `ANAME` record.  Assuming your DNS provider actually supports these types of records, they will not show as "connected". Your connected domain will still work as long as you have created the appropriate DNS records.
* It's not possible to modify the connected domain settings once defined. If you need to make changes, you'll need to:
    1. Delete the connected domain from your 8th Wall project.
    2. Clean up and DNS records added from the previous setup.
    3. Start over with the new custom domain configuration.
* Do **not** use an **A record** for Step 3.  8th Wall hosted experiences are served using a global CDN with hundreds of locations around the globe. Users are automatically routed to the closest/fastest datacenter for maximum performance. You must connect your domain to the unique "xxxxx.cloudfront.net" URL displayed in `Step 3` of the wizard.
