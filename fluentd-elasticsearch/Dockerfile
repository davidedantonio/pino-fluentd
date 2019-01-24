FROM fluent/fluentd:latest

COPY ./fluentd.conf /fluentd/etc/
ONBUILD COPY ./fluent.conf /fluentd/etc/

RUN ["gem", "install", "fluent-plugin-elasticsearch"]