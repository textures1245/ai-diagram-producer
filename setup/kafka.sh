#!/bin/env sh
kafka-topics --bootstrap-server kafka:29092 --list
        
echo -e "Creating topics ..."
kafka-topics --bootstrap-server kafka:29092 --create --if-not-exists --topic chat --replication-factor 1 --partitions 1
kafka-topics --bootstrap-server kafka:29092 --create --if-not-exists --topic workspace --replication-factor 1 --partitions 1
kafka-topics --bootstrap-server kafka:29092 --create --if-not-exists --topic user --replication-factor 1 --partitions 1

echo -e "Successfully created topics:"
kafka-topics --bootstrap-server kafka:29092 --list

#TEMP for debug consumer only
# kafka-console-consumer --bootstrap-server localhost:9092 --topic user --from-beginning