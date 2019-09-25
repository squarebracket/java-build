import * as core from '@actions/core';
import * as io from '@actions/io';
import * as fs from 'fs';
import * as process from 'process';

async function run() {
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
    fs.writeFileSync('toolchains.xml', toolchains);
}

run();    
