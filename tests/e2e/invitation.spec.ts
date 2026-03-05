import { expect, test } from "@playwright/test";

test("mobile flow from intro to info section", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("open-envelope").click();
  await expect(page.getByTestId("hero-content")).toBeVisible();

  await page.getByRole("button", { name: "Սահել ներքև" }).click();
  await expect(page.locator("#story")).toBeVisible();

  await page.getByTestId("rsvp-cta").click();
  await expect(page.locator("#rsvp")).toBeVisible();

  await page.locator("#info").scrollIntoViewIfNeeded();
  await expect(page.locator("#info")).toBeVisible();
});

test("desktop intro and hero parity", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("intro-envelope")).toBeVisible();
  await page.getByTestId("open-envelope").click();

  await expect(page.getByTestId("hero-content")).toBeVisible();
  await expect(page.getByTestId("top-controls")).toBeVisible();
});

test("rsvp submit success", async ({ page }) => {
  await page.route("**/rsvp", route => {
    route.fulfill({ status: 200, body: "ok" });
  });

  await page.goto("/");
  await page.getByTestId("open-envelope").click();
  await page.getByTestId("rsvp-cta").click();

  await page.getByRole("textbox", { name: "Անուն, Ազգանուն" }).fill("Test Guest");
  await page.getByLabel("Լիդիայի").check();
  await page.getByTestId("submit-rsvp").click();

  await expect(page.getByText("Շնորհակալություն, ձեր պատասխանն ընդունվեց։")).toBeVisible();
});

test("rsvp submit error", async ({ page }) => {
  await page.route("**/rsvp", route => {
    route.fulfill({ status: 500, body: "error" });
  });

  await page.goto("/");
  await page.getByTestId("open-envelope").click();
  await page.getByTestId("rsvp-cta").click();

  await page.getByRole("textbox", { name: "Անուն, Ազգանուն" }).fill("Test Guest");
  await page.getByLabel("Լիդիայի").check();
  await page.getByTestId("submit-rsvp").click();

  await expect(page.getByText("Չհաջողվեց ուղարկել։ Փորձեք կրկին։")).toBeVisible();
});
