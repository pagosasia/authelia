
import * as assert from "assert";
import * as sinon from "sinon";
import nedb = require("nedb");
import * as express from "express";
import * as winston from "winston";
import * as speakeasy from "speakeasy";
import * as u2f from "authdog";

import { AppConfiguration, UserConfiguration } from "../../src/lib/Configuration";
import { GlobalDependencies, Nodemailer } from "../../src/lib/Dependencies";
import Server from "../../src/lib/Server";


describe("test server configuration", function () {
  let deps: GlobalDependencies;

  before(function () {
    const transporter = {
      sendMail: sinon.stub().yields()
    };

    const nodemailer: Nodemailer = {
      createTransport: sinon.spy(function () {
        return transporter;
      })
    };

    deps = {
      nodemailer: nodemailer,
      speakeasy: speakeasy,
      u2f: u2f,
      nedb: nedb,
      winston: winston,
      ldapjs: {
        createClient: sinon.spy(function () {
          return { on: sinon.spy() };
        })
      },
      session: sinon.spy(function () {
        return function (req: express.Request, res: express.Response, next: express.NextFunction) { next(); };
      })
    };
  });


  it("should set cookie scope to domain set in the config", function () {
    const config = {
      session: {
        domain: "example.com",
        secret: "secret"
      },
      ldap: {
        url: "http://ldap",
        user: "user",
        password: "password"
      },
      notifier: {
        gmail: {
          username: "user@example.com",
          password: "password"
        }
      }
    } as UserConfiguration;

    const server = new Server();
    server.start(config, deps);

    assert(deps.session.calledOnce);
    assert.equal(deps.session.getCall(0).args[0].cookie.domain, "example.com");
  });
});
