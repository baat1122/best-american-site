# Deployment Guide: GitHub & Vercel Setup

This guide provides step-by-step instructions to configure your project for your new GitHub account (`baat1122`) and deploy it to Vercel.

---

## Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Make sure you are logged in to your new GitHub account: **`baat1122`**.
3. Set the **Repository name** to: `best-american-site` (or any name you prefer).
4. Set the repository to **Private** (or Public, depending on your preference).
5. **Do NOT** check any of the initialization options (do not add a README, `.gitignore`, or license, as we already have these files locally).
6. Click **Create repository**.

---

## Step 2: Connect your Local Project to the New Repository
Open your terminal (PowerShell, Command Prompt, or VS Code Terminal) in the project directory (`c:\Users\faddi\Downloads\neon-site-20260615T222253Z-3-001\neon-site`) and run the following commands:

1. **Update the GitHub Remote URL**:
   Run the command below (replace `<YOUR_REPO_NAME>` with the exact name you chose in Step 1, e.g., `best-american-site`):
   ```bash
   git remote set-url origin https://github.com/baat1122/<YOUR_REPO_NAME>.git
   ```

2. **Commit Your Local Changes**:
   Stage and commit the Web3Forms key changes, chatbot fallback integrations, and the `.env` settings:
   ```bash
   git add .
   git commit -m "Configure new Web3Forms keys, Gemini API fallback, and rebrand updates"
   ```

3. **Push to the New Repository**:
   Upload the code to your new GitHub account:
   ```bash
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** in the top right corner and select **Project**.
3. Under "Import Git Repository", find your new repository (e.g., `baat1122/best-american-site`) and click **Import**.
   * *If the repository is not listed, click "Adjust GitHub App Permissions" to authorize Vercel to access the `baat1122` organization/account.*
4. In the **Configure Project** screen:
   * Keep the **Framework Preset** as **Other** (since this is a vanilla HTML/JS site).
   * Leave the **Root Directory** as `./`.
5. Expand the **Environment Variables** section and add the following:
   * **Name**: `GEMINI_API_KEY`
   * **Value**: `AQ.Ab8RN6J2lyEfxnWXHY2R8tisdYKAWZFnsi94QXrJuAtL_ZOfXw`
6. Click the **Deploy** button.

Once Vercel finishes the deployment, you will receive a production URL (e.g. `https://best-american-site.vercel.app`) where your website, cost calculator, forms, and conversational AI chatbot will all be fully functional and connected!
