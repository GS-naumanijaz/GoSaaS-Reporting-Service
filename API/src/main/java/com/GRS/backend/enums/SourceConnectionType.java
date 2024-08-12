package com.GRS.backend.enums;

import java.util.Arrays;

public enum SourceConnectionType {
    SQL("sql", "com.mysql.cj.jdbc.Driver"),
    POSTGRES("postgresql", "org.postgresql.Driver"),
    MYSQL("mysql", "com.mysql.cj.jdbc.Driver"),
    MARIADB("mariadb", "org.mariadb.jdbc.Driver"),
    ORACLE("oracle", "oracle.jdbc.OracleDriver"),
    SQLSERVER("sqlserver", "com.microsoft.sqlserver.jdbc.SQLServerDriver"),
    SQLITE("sqlite", "org.sqlite.JDBC"),
    H2("h2", "org.h2.Driver"),
    DB2("db2", "com.ibm.db2.jcc.DB2Driver"),
    DERBY("derby", "org.apache.derby.jdbc.ClientDriver"),
    HSQLDB("hsqldb", "org.hsqldb.jdbc.JDBCDriver"),
    FIREBIRD("firebirdsql", "org.firebirdsql.jdbc.FBDriver"),
    CASSANDRA("cassandra", "com.github.cassandra.jdbc.CassandraDriver"),
    MONGO("mongo", "mongodb.jdbc.MongoDriver"),
    INFORMIX("informix", "com.informix.jdbc.IfxDriver"),
    SYBASE("sybase", "com.sybase.jdbc4.jdbc.SybDriver"),
    AWSATHENA("awsathena", "com.simba.athena.jdbc.Driver"),
    NEO4J("neo4j", "org.neo4j.jdbc.Driver"),
    SNOWFLAKE("snowflake", "net.snowflake.client.jdbc.SnowflakeDriver"),
    REDSHIFT("redshift", "com.amazon.redshift.jdbc.Driver"),
    PRESTO("presto", "io.prestosql.jdbc.PrestoDriver");

    private final String dbType;
    private final String driverClassName;

    SourceConnectionType(String dbType, String driverClassName) {
        this.dbType = dbType;
        this.driverClassName = driverClassName;
    }

    public String getDbType() {
        return dbType;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public static String[] getDbTypes() {
        return Arrays.stream(SourceConnectionType.values())
                .map(SourceConnectionType::getDbType)
                .toArray(String[]::new);
    }
}
