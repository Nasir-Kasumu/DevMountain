const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("clicking the draw button displays the div with id=choices", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    await driver.wait(until.elementLocated(By.id("choices")), 1000);
  });

  test("clicking 'All bots' button displays the div with id='all-bots'", async () => {
    await driver.get("http://localhost:8000");
    const botsBtn = await driver.findElement(By.id("see-all"));
    await botsBtn.click();
    await driver.wait(until.elementLocated(By.id("all-bots")), 1000);
  });

});