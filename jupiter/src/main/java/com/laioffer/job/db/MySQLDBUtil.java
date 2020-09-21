package com.laioffer.job.db;

public class MySQLDBUtil {
    private static final String INSTANCE = "lai-project1.crj9qvt1cyc2.us-west-1.rds.amazonaws.com"    ;
    private static final String PORT_NUM = "3306";
    public static final String DB_NAME = "job_project";
    private static final String USERNAME = "admin";
    private static final String PASSWORD = "zxcv1996";
    public static final String URL = "jdbc:mysql://"
            + INSTANCE + ":" + PORT_NUM + "/" + DB_NAME
            + "?user=" + USERNAME + "&password=" + PASSWORD
            + "&autoReconnect=true&serverTimezone=UTC";

}
