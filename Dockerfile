# Fhir server build on IRIS
FROM intersystemsdc/irishealth-community:latest

USER root

ENV DEBIAN_FRONTEND noninteractive

# Update package and install sudo
RUN apt-get update && apt-get install -y \
	nano \
	sudo && \
	/bin/echo -e ${ISC_PACKAGE_MGRUSER}\\tALL=\(ALL\)\\tNOPASSWD: ALL >> /etc/sudoers && \
	sudo -u ${ISC_PACKAGE_MGRUSER} sudo echo enabled passwordless sudo-ing for ${ISC_PACKAGE_MGRUSER}

WORKDIR /irisdev/app
RUN chown ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} /irisdev/app
USER ${ISC_PACKAGE_MGRUSER}

COPY . /irisdev/app

# load demo stuff
RUN iris start IRIS \
	&& iris session IRIS < /irisdev/app/iris.script && iris stop IRIS quietly

ENV IRISUSERNAME "SuperUser"
ENV IRISPASSWORD "SYS"
ENV IRISNAMESPACE "IRISAPP"