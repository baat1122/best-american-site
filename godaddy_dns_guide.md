# Domain Setup Guide: Connecting GoDaddy Domain to Vercel

Follow these steps to connect your custom domain **`bestamericanautotransport.com`** to your Vercel deployment.

---

## Step 1: Add the Domain in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Select your project (e.g., `best-american-site`).
3. Click on the **Settings** tab at the top.
4. In the left sidebar, click on **Domains**.
5. In the input box, type: **`bestamericanautotransport.com`** and click **Add**.
6. When prompted, select the recommended option: **"Redirect bestamericanautotransport.com to www.bestamericanautotransport.com"** and click **Add**.
7. Vercel will display two domain entries with a status of "Invalid Configuration" and show you the exact DNS records you need to add to GoDaddy:
   * **Apex Domain (`bestamericanautotransport.com`)**: Requires an `A` record.
   * **Subdomain (`www.bestamericanautotransport.com`)**: Requires a `CNAME` record.

---

## Step 2: Configure GoDaddy DNS Settings
1. Log in to your [GoDaddy Domain Portfolio](https://dcc.godaddy.com/control/portfolio).
2. Click on the three dots next to **`bestamericanautotransport.com`** and select **Manage DNS** (or click the domain name, scroll down to the **Additional Settings** section, and click **Manage DNS**).
3. Under the **DNS Records** section, you will modify/add the following two records:

### 1. The A Record (For the Root Domain)
* **Check if it exists**: Look for a record with Type `A` and Name `@`.
* **If it exists**: Click the edit pencil icon next to it and update the **Value** (Points to) to:
  ```text
  76.76.21.21
  ```
* **If it does not exist**: Click **Add New Record** at the bottom:
  * **Type**: `A`
  * **Name**: `@`
  * **Value**: `76.76.21.21`
  * **TTL**: `Default` (or `1 Hour`)
  * Click **Save**.

### 2. The CNAME Record (For the www Subdomain)
* **Check if it exists**: Look for a record with Type `CNAME` and Name `www`.
* **If it exists**: Click the edit pencil icon next to it and update the **Value** (Points to) to:
  ```text
  cname.vercel-dns.com
  ```
* **If it does not exist**: Click **Add New Record**:
  * **Type**: `CNAME`
  * **Name**: `www`
  * **Value**: `cname.vercel-dns.com`
  * **TTL**: `Default` (or `1 Hour`)
  * Click **Save**.

> [!WARNING]
> If you see any other `A` records pointing to other IP addresses, or any other `CNAME` records with Name `www` pointing elsewhere, **delete them** to prevent conflicts.

---

## Step 3: Verify and Activate in Vercel
1. Return to your Vercel Dashboard -> **Settings** -> **Domains**.
2. Vercel will periodically poll your DNS. You can force it to check immediately by clicking the **Refresh** button on the domain card.
3. Once GoDaddy updates the DNS (typically takes 1 to 10 minutes, but can take up to 2 hours), the status will change to a green **Active** badge.
4. Vercel will automatically generate and configure a free SSL certificate (HTTPS) for both the root and `www` versions of your site.

Your site will then be live at [www.bestamericanautotransport.com](https://www.bestamericanautotransport.com)!
