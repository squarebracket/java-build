import * as core from '@actions/core';
import * as fs from 'fs';
import * as process from 'process';

async function run() {
    const jdkVersion = core.getInput('jdkVersion', { required: true });
    console.log(`Writing out toolchains.xml for JDK ${jdkVersion}`);
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
    fs.writeFileSync(process.env.HOME + '/.m2/toolchains.xml', toolchains);
}

run();    
