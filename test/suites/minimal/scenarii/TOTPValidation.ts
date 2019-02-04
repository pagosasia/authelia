import FillLoginPageWithUserAndPasswordAndClick from '../../../helpers/FillLoginPageAndClick';
import WaitRedirected from '../../../helpers/WaitRedirected';
import VisitPage from '../../../helpers/VisitPage';
import ValidateTotp from '../../../helpers/ValidateTotp';
import AccessSecret from "../../../helpers/AccessSecret";
import LoginAndRegisterTotp from '../../../helpers/LoginAndRegisterTotp';
import SeeNotification from '../../../helpers/SeeNotification';
import { AUTHENTICATION_TOTP_FAILED } from '../../../../shared/UserMessages';

export default function() {
  /**
 * Given john has registered a TOTP secret,
 * When he validates the TOTP second factor,
 * Then he has access to secret page.
 */
  describe('Successfully pass second factor with TOTP', function() {
    beforeEach(async function() {
      const secret = await LoginAndRegisterTotp(this.driver, "john", true);
      if (!secret) throw new Error('No secret!');
      
      await VisitPage(this.driver, "https://login.example.com:8080/?rd=https://admin.example.com:8080/secret.html");
      await FillLoginPageWithUserAndPasswordAndClick(this.driver, 'john', 'password');
      await ValidateTotp(this.driver, secret);
      await WaitRedirected(this.driver, "https://admin.example.com:8080/secret.html");
    });

    it("should access the secret", async function() {
      await AccessSecret(this.driver);
    });
  });

  /**
 * Given john has registered a TOTP secret,
 * When he fails the TOTP challenge,
 * Then he gets a notification message.
 */
  describe('Fail validation of second factor with TOTP', function() {
    beforeEach(async function() {
      await LoginAndRegisterTotp(this.driver, "john", true);
      const BAD_TOKEN = "125478";
        
        await VisitPage(this.driver, "https://login.example.com:8080/?rd=https://admin.example.com:8080/secret.html");
        await FillLoginPageWithUserAndPasswordAndClick(this.driver, 'john', 'password');
        await ValidateTotp(this.driver, BAD_TOKEN);
    });

    it("get a notification message", async function() {
      await SeeNotification(this.driver, "error", AUTHENTICATION_TOTP_FAILED);
    });
  });
}