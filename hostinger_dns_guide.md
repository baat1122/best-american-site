# DNS Setup Guide: Hostinger Managed DNS (Domain registered at GoDaddy)

If your domain **`bestamericanautotransport.com`** is registered at GoDaddy but you have pointed the nameservers to Hostinger, your DNS records must be configured in **Hostinger hPanel** instead of GoDaddy.

Follow these steps to connect your domain to Vercel:

---

## Step 1: Add the Domain in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Select your project (e.g., `best-american-site`).
3. Click on the **Settings** tab -> **Domains**.
4. Type **`bestamericanautotransport.com`** and click **Add**.
5. Select the recommended option: **"Redirect bestamericanautotransport.com to www.bestamericanautotransport.com"** and click **Add**.

---

## Step 2: Configure Hostinger DNS Settings
1. Log in to your **[Hostinger hPanel](https://hpanel.hostinger.com)**.
2. In the top navigation bar or sidebar, click on **Domains**.
3. Click **Manage** next to **`bestamericanautotransport.com`**.
4. In the left-hand menu, select **DNS / Nameservers** (or look for the **DNS Zone Editor** tool).
5. In the **DNS Zone Editor** table, add or edit the following two records:

### 1. The A Record (For the Root Domain)
* **Check if it exists**: Look for a record of type `A` with Name `@` (or blank).
* **If it exists**: Click **Edit** next to it and update the **Points to (Value)** to:
  ```text
  76.76.21.21
  ```
* **If it does not exist**: Go to the **Manage DNS records** section at the top of the editor:
  * **Type**: `A`
  * **Name**: `@`
  * **Points to**: `76.76.21.21`
  * **TTL**: `14400` (or `3600` / Default)
  * Click **Add Record**.

### 2. The CNAME Record (For the www Subdomain)
* **Check if it exists**: Look for a record of type `CNAME` with Name `www`.
* **If it exists**: Click **Edit** next to it and update the **Points to (Value)** to:
  ```text
  cname.vercel-dns.com
  ```
* **If it does not exist**: Go to the **Manage DNS records** section:
  * **Type**: `CNAME`
  * **Name**: `www`
  * **Points to**: `cname.vercel-dns.com`
  * **TTL**: `14400` (or `3600` / Default)
  * Click **Add Record**.

> [!WARNING]
> * **Delete all existing `AAAA` records for Host `@`**: Hostinger often sets up default IPv6 (`AAAA`) records pointing to their servers. **You MUST delete any `AAAA` records for `@`** (such as the one pointing to `2a02:4780:1:572:0:1f2d:fd18:3`), otherwise modern devices using IPv6 will continue to load the old Hostinger site instead of Vercel!
> * **Delete other A and CNAME records**: Delete any other `A` records for `@` or `CNAME` records for `www` that do not point to Vercel, so Vercel is the sole handler of domain traffic.

---

## Step 3: Verify in Vercel
1. Go back to Vercel Dashboard -> **Settings** -> **Domains**.
2. Click the **Refresh** button on the domain cards.
3. Once the DNS propagates (usually takes 5 to 15 minutes), the status will change to a green **Active** badge, and SSL will be generated automatically.

Your site will then be fully live and secure at [www.bestamericanautotransport.com](https://www.bestamericanautotransport.com)!
