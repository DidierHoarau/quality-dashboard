import * as fse from "fs-extra";
import { sandbox } from "../utils-std-ts/test-utils";
import { ReportsDB } from "./ReportsDB";

describe("ReportsDB", () => {
  //
  describe("init", () => {
    //
    test("Create if not exist", done => {
      sandbox.stub(fse, "ensureDir").callsFake(async () => {
        return;
      });
      sandbox.stub(fse, "existsSync").callsFake(() => {
        return false;
      });
      sandbox.stub(fse, "writeJSON").callsFake(async () => {
        done();
        return;
      });
      ReportsDB.init();
    });
  });

  describe("add", () => {
    test("Add a first report", async () => {
      sandbox.stub(fse, "writeJSON").callsFake(async () => {
        return;
      });
      await ReportsDB.reset();
      await ReportsDB.add("testGroup", "testProject", "testVersion", "testReport", "testProcessor", {});
      const dbContent = await ReportsDB.list();
      expect(dbContent).toHaveProperty("groups");
      expect(dbContent.groups[0]).toHaveProperty("projects");
      expect(dbContent.groups[0].projects[0]).toHaveProperty("versions");
      expect(dbContent.groups[0].projects[0].versions[0]).toHaveProperty("reports");
    });
  });

  describe("delete", () => {
    test("delete a version", async () => {
      sandbox.stub(fse, "writeJSON").callsFake(async () => {
        return;
      });
      await ReportsDB.reset();
      await ReportsDB.add("testGroup", "testProject", "testVersion", "testReport", "testProcessor", {});
      await ReportsDB.add("testGroup", "testProject", "testVersion2", "testReport", "testProcessor", {});
      let dbContent = await ReportsDB.list();
      expect(dbContent.groups[0].projects[0].versions).toHaveLength(2);
      await ReportsDB.deleteVersion("testGroup", "testProject", "testVersion2");
      dbContent = await ReportsDB.list();
      expect(dbContent.groups[0].projects[0].versions).toHaveLength(1);
    });
  });
});
