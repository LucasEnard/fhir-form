FROM intersystemsdc/irishealth-community

COPY --chown=irisowner:irisowner ./data/fhir /home/irisowner/fhirdata
COPY --chown=irisowner:irisowner ./e2e-tests/data/R4 /home/irisowner/fhirdata

RUN \
	--mount=type=bind,src=.,dst=/home/irisowner/fhirapp \
	--mount=type=bind,src=./iris.script,dst=/tmp/iris.script \
	iris start IRIS && \
	# iris session IRIS '##class(%ZPM.PackageManager).Shell("load /home/irisowner/fhirapp -v",1,1)' && \
	iris session IRIS < /tmp/iris.script && \
	iris stop iris quietly
