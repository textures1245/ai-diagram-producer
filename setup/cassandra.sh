#!/usr/bin/env bash
until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do
    sleep 5
    echo "Waiting for cassandra..."
done

echo "Initialising Cassandra ..."
cqlsh cassandra -e "CREATE KEYSPACE IF NOT EXISTS ai_ctx_dev WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"

# using in analyzer domain
cqlsh cassandra -e "CREATE TABLE IF NOT EXISTS ai_ctx_dev.chats (guid text, user_guid text, workspace_guid text, content text, role text, images text, tool_calls text, version int, PRIMARY KEY ((guid), user_guid, workspace_guid);"
cqlsh cassandra -e "CREATE TABLE IF NOT EXISTS ai_ctx_dev.workspaces (guid text, user_guid text, created_at timestamp, version int, PRIMARY KEY ((guid), user_guid);"

# using in presenter domain
cqlsh cassandra -e "CREATE TABLE IF NOT EXISTS ai_ctx_dev.users (guid text , name text, created_at timestamp, updated_at timestamp, version int, PRIMARY KEY (guid));"