import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "../wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/TSender/);
});

test(
  "should show `Please connect a wallet` message in button when `" +
    "Send Token` button is clicked but wallet not connected, otherwise proceed to send",
  async ({ page, context, metamaskPage, extensionId }) => {
    await page.goto("http://localhost:3000");

    await page
      .getByRole("textbox", { name: "Token Address" })
      .fill("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    await page
      .getByRole("textbox", { name: "Recipients" })
      .fill("0xfE4B2518D8ae05Bbf2a53Cbe2Afdf52D2B87b0C0");
    await page
      .getByRole("textbox", { name: "Amounts" })
      .fill("10000000000000000000");

    const sendButton = page.getByRole("button", { name: /Send Token/i });

    await sendButton.click();

    // Expect the button to show the "Please connect a wallet" message
    const warningButton = page.getByRole("button", {
      name: /Please connect to wallet first/i,
    });
    await expect(warningButton).toBeVisible();
    const metamask = new MetaMask(
      context,
      metamaskPage,
      basicSetup.walletPassword,
      extensionId
    );
    await page.getByTestId("rk-connect-button").click();
    await page
      .getByTestId("rk-wallet-option-metaMask")
      .waitFor({ state: "visible", timeout: 30000 });
    await page.getByTestId("rk-wallet-option-metaMask").click();
    await metamask.connectToDapp();

    const customNetwork = {
      name: "Anvil",
      rpcUrl: "http://127.0.0.1:8545",
      chainId: 31337,
      symbol: "ETH",
    };
    await metamask.addNetwork(customNetwork);
  }
);

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();
//
//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('head--ing', { name: 'Installation' })).toBeVisible();
// });
