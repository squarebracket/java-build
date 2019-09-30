ARG JDK_VERSION=latest
FROM maven:3-jdk-${JDK_VERSION}

ARG CI_PROJECT_URL
LABEL org.opencontainers.image.source="${CI_PROJECT_URL}" \
      org.opencontainers.image.title="Java Build" \
      org.opencontainers.image.description="Image meant to be used to build Java applications"

RUN \
    # We add rpm and file for builds in which an RPM is also built by Maven
    apt-get update && apt-get install -y \
    rpm \
    file \
    # Adding bc to do some arithmetic for line coverage if needed
    bc

# Adding a toolchain for the jdk included in this image
COPY toolchains.xml /root/.m2/

