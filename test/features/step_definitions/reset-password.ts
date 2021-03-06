import {When} from "cucumber";
import seleniumWebdriver = require("selenium-webdriver");
import Assert = require("assert");
import Fs = require("fs");

When("I click on the link {string}", function (text: string) {
  return this.driver.findElement(seleniumWebdriver.By.linkText(text)).click();
});

When("I click on the link of the email", function () {
  const that = this;
  return this.retrieveLatestMail()
    .then(function (link: string) {
      return that.driver.get(link);
    });
});