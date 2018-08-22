FROM node:9.11.2-slim

ENV CLOUD_SDK_VERSION 206.0.0
ENV SONAR_VERSION 3.2.0.1227

ENV PATH /google-cloud-sdk/bin:$PATH
RUN   mkdir -p /usr/share/man/man1/ && \
      echo "deb http://ftp.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list && \
      apt-get update && \
      apt-get install -qq -t jessie-backports ca-certificates-java && \
      apt-get -qq install \
      openjdk-8-jre-headless \
      apt-transport-https \
      ca-certificates \
      curl \
      software-properties-common \
      openssh-client \
      git \
      python-pip \
      python-dev \
      build-essential \
      gnupg2 \
      libssl-dev \
      libtool \
      m4 \
      automake \
      pkg-config \
      vim \
      unzip \
      entr \
      silversearcher-ag \
      && apt-get remove -qq openjdk-7-jre-headless

# Install SONAR
RUN mkdir -p /tmp/sonar \
      && curl --insecure -OL https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_VERSION}.zip \
      && unzip sonar-scanner-cli-${SONAR_VERSION}.zip \
      && mkdir -p /opt/sonar \
      && mv sonar-scanner-${SONAR_VERSION}/* /opt/sonar

# Install firebase, clojure and clojurescript
RUN yarn global add flow flow-bin firebase-tools \
      grommet-cli gulp@next eslint flow-bin

# 036A9C25BF357DD4 - Tianon Gravi <tianon@tianon.xyz>
#   http://pgp.mit.edu/pks/lookup?op=vindex&search=0x036A9C25BF357DD4
ENV GOSU_VERSION="1.10" \
      GOSU_DOWNLOAD_URL="https://github.com/tianon/gosu/releases/download/1.10/gosu-amd64" \
      GOSU_DOWNLOAD_SIG="https://github.com/tianon/gosu/releases/download/1.10/gosu-amd64.asc" \
      GOSU_DOWNLOAD_KEY="0x036a9c25bf357dd4"

COPY ./entrypoint.sh ./git-version.py ./get-gosu-verification-key.sh /usr/local/bin/
RUN chmod 777 /usr/local/bin/git-version.py \
      && chmod 777 /usr/local/bin/get-gosu-verification-key.sh  \
      && chmod 777 /usr/local/bin/entrypoint.sh

RUN gpg-agent --daemon \
      &&  /usr/local/bin/get-gosu-verification-key.sh $GOSU_DOWNLOAD_KEY \
      && echo "trusted-key $GOSU_DOWNLOAD_KEY" >> /root/.gnupg/gpg.conf \
      && curl -sSL "$GOSU_DOWNLOAD_URL" > gosu-amd64 \
      && curl -sSL "$GOSU_DOWNLOAD_SIG" > gosu-amd64.asc \
      && gpg --verify gosu-amd64.asc \
      && rm -f gosu-amd64.asc \
      && mv gosu-amd64 /usr/local/bin/gosu \
      && chmod +x /usr/local/bin/gosu  \
      && chmod +x /usr/local/bin/entrypoint.sh

VOLUME ["/var/build"]

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
