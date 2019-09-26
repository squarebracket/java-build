"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const jdkVersion = core.getInput('jdkVersion', { required: true });
        const toolchains = `
<?xml version="1.0" encoding="UTF8"?>
<toolchains>
  <!-- JDK toolchains -->
  <toolchain>
    <type>jdk</type>
    <provides>
      <version>1.${jdkVersion}</version>
      <vendor>openjdk</vendor>
    </provides>
    <configuration>
        <jdkHome>\${env.JAVA_HOME}</jdkHome>
    </configuration>
  </toolchain>
</toolchains>
`;
        core.debug(`Writing out toolchains.xml for JDK ${jdkVersion}`);
        core.debug(`${process.env.GITHUB_WORKSPACE}/toolchains.xml`);
        fs.writeFileSync(process.env.GITHUB_WORKSPACE + '/toolchains.xml', toolchains);
    });
}
run();
